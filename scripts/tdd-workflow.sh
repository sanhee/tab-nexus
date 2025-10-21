#!/bin/bash

# TDD 워크플로우 검증 스크립트
# 사용법: ./scripts/tdd-workflow.sh [red|green|refactor]

set -e  # 에러 발생 시 스크립트 중단

PHASE=$1

if [ -z "$PHASE" ]; then
    echo "❌ Phase를 지정해주세요: red, green, refactor"
    exit 1
fi

# 프로젝트 루트 기준으로 frontend 디렉토리로 이동
cd "$(dirname "$0")/../frontend"

echo "🔄 Phase: $PHASE 검증 시작..."

# 공통 검증 함수
check_typescript() {
    echo "📝 TypeScript 컴파일 확인..."
    if ! npm run build > /dev/null 2>&1; then
        echo "❌ TypeScript 컴파일 오류 발생!"
        npm run build
        exit 1
    fi
    echo "✅ TypeScript 컴파일 통과"
}

check_lint() {
    echo "🔍 ESLint 검사..."
    if ! npm run lint > /dev/null 2>&1; then
        echo "❌ ESLint 오류 발생!"
        npm run lint
        exit 1
    fi
    echo "✅ ESLint 검사 통과"
}

run_tests() {
    echo "🧪 테스트 실행..."
    if ! npm test > /dev/null 2>&1; then
        echo "❌ 테스트 실패!"
        npm test
        exit 1
    fi
    echo "✅ 모든 테스트 통과"
}

case $PHASE in
    "red")
        echo "🔴 Red Phase 검증 중..."

        # 1. TypeScript 타입 체크 (컴파일은 실패해도 됨)
        echo "📝 타입 체크 (컴파일 오류는 허용)..."
        npx tsc --noEmit --skipLibCheck || echo "⚠️ 컴파일 오류 있음 (Red Phase에서는 정상)"

        # 2. 테스트가 실패하는지 확인
        echo "🧪 테스트가 실패하는지 확인..."
        if npm test > /dev/null 2>&1; then
            echo "❌ 테스트가 성공했습니다. Red Phase에서는 테스트가 실패해야 합니다!"
            exit 1
        fi
        echo "✅ 테스트가 예상대로 실패함 (Red Phase 완료)"
        ;;

    "green")
        echo "🟢 Green Phase 검증 중..."

        # 1. 의존성 확인
        echo "📦 필수 의존성 확인..."
        npm ls zustand > /dev/null 2>&1 || (echo "❌ zustand 패키지 없음!" && exit 1)

        # 2. TypeScript 컴파일
        check_typescript

        # 3. 테스트 통과 확인
        run_tests

        echo "✅ Green Phase 완료!"
        ;;

    "refactor")
        echo "🔵 Refactor Phase 검증 중..."

        # 1. TypeScript 컴파일
        check_typescript

        # 2. ESLint 검사
        check_lint

        # 3. 테스트 통과 확인
        run_tests

        # 4. 테스트 커버리지 확인 (90% 이상)
        echo "📊 테스트 커버리지 확인..."
        COVERAGE=$(npm run test:coverage 2>/dev/null | grep "All files" | awk '{print $4}' | sed 's/%//')
        if [ "$COVERAGE" -lt 90 ]; then
            echo "⚠️ 테스트 커버리지가 90% 미만입니다: ${COVERAGE}%"
        else
            echo "✅ 테스트 커버리지 양호: ${COVERAGE}%"
        fi

        echo "✅ Refactor Phase 완료!"
        ;;

    *)
        echo "❌ 유효하지 않은 Phase: $PHASE"
        echo "사용 가능한 Phase: red, green, refactor"
        exit 1
        ;;
esac

echo "🎉 $PHASE Phase 검증 완료!"