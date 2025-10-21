#!/bin/bash

# Phase 2.1 실수 경험을 바탕으로 한 PR 생성 전 필수 체크 스크립트
# 사용법: ./scripts/pre-pr-check.sh

set -e

echo "🔍 PR 생성 전 필수 검증 시작..."

# 프로젝트 루트로 이동
cd "$(dirname "$0")/.."

ERRORS=0

echo ""
echo "📋 1. PR 템플릿 확인..."
if [ -f ".github/pull_request_template.md" ]; then
    echo "✅ PR 템플릿 존재: .github/pull_request_template.md"
    echo "⚠️  PR 생성 시 반드시 이 템플릿 형식을 따르세요!"
else
    echo "❌ PR 템플릿 없음"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "🔍 2. 하드코딩된 경로 검사..."
HARDCODED_PATHS=$(grep -r "/Users/" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md" 2>/dev/null || true)
if [ -z "$HARDCODED_PATHS" ]; then
    echo "✅ 하드코딩된 경로 없음"
else
    echo "❌ 하드코딩된 경로 발견:"
    echo "$HARDCODED_PATHS"
    echo "💡 $(dirname \"\$0\") 패턴 사용 권장"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "⚡ 3. TypeScript Non-null Assertion 검사..."
NON_NULL_ASSERTIONS=$(grep -r "\!" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "// eslint-disable" | grep -v "!" || true)
if [ -z "$NON_NULL_ASSERTIONS" ]; then
    echo "✅ Non-null assertion 없음"
else
    echo "⚠️  Non-null assertion 발견:"
    echo "$NON_NULL_ASSERTIONS"
    echo "💡 ?? [] 패턴으로 안전한 fallback 사용 권장"
fi

echo ""
echo "🔧 4. 워크플로우 파일 변경 확인..."
WORKFLOW_CHANGES=$(git diff --name-only HEAD^ 2>/dev/null | grep ".github/workflows/" || true)
if [ -z "$WORKFLOW_CHANGES" ]; then
    echo "✅ 워크플로우 파일 변경 없음"
else
    echo "⚠️  워크플로우 파일 변경 감지:"
    echo "$WORKFLOW_CHANGES"
    echo "💡 PAT에 workflow scope가 있는지 확인하세요!"
fi

echo ""
echo "📋 5. 커밋 메시지 컨벤션 확인..."
RECENT_COMMITS=$(git log --oneline -5 --pretty=format:"%s")
INVALID_COMMITS=$(echo "$RECENT_COMMITS" | grep -v "^\[#[0-9]\+\]" || true)
if [ -z "$INVALID_COMMITS" ]; then
    echo "✅ 최근 커밋들이 [#이슈번호] 컨벤션을 따름"
else
    echo "⚠️  이슈 번호가 없는 커밋 발견:"
    echo "$INVALID_COMMITS"
    echo "💡 Phase 2.2부터 '[#이슈번호] 타입: 변경사항' 형식 사용"
fi

echo ""
echo "📝 6. TypeScript 컴파일 확인..."
cd frontend
if npm run build > /dev/null 2>&1; then
    echo "✅ TypeScript 컴파일 성공"
else
    echo "❌ TypeScript 컴파일 실패"
    echo "💡 npm run build로 에러 확인하세요"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "🧪 7. 테스트 실행 확인..."
if npm test > /dev/null 2>&1; then
    echo "✅ 모든 테스트 통과"
else
    echo "❌ 테스트 실패"
    echo "💡 npm test로 실패한 테스트 확인하세요"
    ERRORS=$((ERRORS + 1))
fi

cd ..

echo ""
echo "📊 검증 결과 요약"
echo "=================="
if [ $ERRORS -eq 0 ]; then
    echo "🎉 모든 검증 통과! PR 생성 준비 완료"
    echo ""
    echo "📋 다음 단계:"
    echo "1. .github/pull_request_template.md 템플릿 확인"
    echo "2. gh pr create로 PR 생성"
    echo "3. Copilot 리뷰 시 gh api repos/.../pulls/.../comments로 상세 확인"
    exit 0
else
    echo "❌ $ERRORS개 오류 발견! PR 생성 전 수정 필요"
    echo ""
    echo "🔧 수정 후 다시 실행하세요:"
    echo "./scripts/pre-pr-check.sh"
    exit 1
fi