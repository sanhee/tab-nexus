#!/bin/bash

# Phase 2.1 Collection Store 검증 스크립트
# Zustand 컬렉션 스토어 TDD 구현 검증

set -e
FRONTEND_DIR="/Users/al03176821/sideproject/tab-nexus/frontend"

echo "🔍 Phase 2.1: Collection Store 검증 시작..."

cd "$FRONTEND_DIR"

# 1. 필수 의존성 확인
echo "📦 Zustand 의존성 확인..."
if ! npm ls zustand > /dev/null 2>&1; then
    echo "❌ zustand 패키지가 설치되지 않았습니다!"
    exit 1
fi
echo "✅ Zustand 패키지 확인 완료"

# 2. 컬렉션 스토어 파일 존재 확인
STORE_FILE="src/stores/collection-store.ts"
TEST_FILE="src/test/stores/collection-store.test.ts"

if [ ! -f "$STORE_FILE" ]; then
    echo "❌ 컬렉션 스토어 파일이 없습니다: $STORE_FILE"
    exit 1
fi

if [ ! -f "$TEST_FILE" ]; then
    echo "❌ 컬렉션 스토어 테스트 파일이 없습니다: $TEST_FILE"
    exit 1
fi

echo "✅ 필수 파일 존재 확인 완료"

# 3. 컬렉션 스토어 TypeScript 컴파일 확인 (프로젝트 컨텍스트)
echo "📝 컬렉션 스토어 타입 체크..."
if ! npx tsc --noEmit --skipLibCheck > /dev/null 2>&1; then
    echo "❌ 컬렉션 스토어 타입 체크 실패!"
    echo "⚠️ 프로젝트 전체 타입 체크를 실행합니다..."
    npx tsc --noEmit --skipLibCheck
    exit 1
fi
echo "✅ 컬렉션 스토어 타입 체크 통과"

# 4. 컬렉션 스토어 테스트 실행
echo "🧪 컬렉션 스토어 테스트 실행..."
if ! npm test "$TEST_FILE" > /dev/null 2>&1; then
    echo "❌ 컬렉션 스토어 테스트 실패!"
    npm test "$TEST_FILE"
    exit 1
fi

# 테스트 결과 요약 출력
echo "📊 테스트 결과:"
npm test "$TEST_FILE" --reporter=verbose | grep -E "(✓|passed|Test Files)"

echo "✅ Phase 2.1 Collection Store 검증 완료!"
echo "🎉 TDD Red-Green-Refactor 사이클 성공적으로 완료!"