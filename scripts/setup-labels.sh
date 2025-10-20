#!/bin/bash

# Tab Nexus GitHub Labels 설정 스크립트
# 사용법: ./scripts/setup-labels.sh

echo "🏷️  Tab Nexus GitHub Labels 설정 중..."

# GitHub CLI 설치 확인
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh)가 설치되지 않았습니다."
    echo "설치 방법: brew install gh"
    exit 1
fi

# GitHub 인증 확인
if ! gh auth status &> /dev/null; then
    echo "❌ GitHub CLI 인증이 필요합니다."
    echo "인증 방법: gh auth login"
    exit 1
fi

# 현재 디렉토리가 Git 저장소인지 확인
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    echo "❌ 현재 디렉토리가 Git 저장소가 아닙니다."
    exit 1
fi

# 라벨 설정 파일 확인
if [ ! -f ".github/labels.yml" ]; then
    echo "❌ .github/labels.yml 파일이 없습니다."
    exit 1
fi

echo "✅ 사전 조건 확인 완료"

# 기존 기본 라벨 제거 (선택적)
read -p "🗑️  기존 GitHub 기본 라벨을 제거하시겠습니까? (y/N): " remove_defaults

if [[ $remove_defaults =~ ^[Yy]$ ]]; then
    echo "🗑️  기존 기본 라벨 제거 중..."

    # GitHub 기본 라벨들
    default_labels=(
        "bug"
        "documentation"
        "duplicate"
        "enhancement"
        "good first issue"
        "help wanted"
        "invalid"
        "question"
        "wontfix"
    )

    for label in "${default_labels[@]}"; do
        gh label delete "$label" --yes 2>/dev/null || echo "  - '$label' 라벨이 없거나 삭제 실패"
    done
fi

# 새 라벨 동기화
echo "🔄 새로운 라벨 동기화 중..."

# labels.yml 파일의 라벨들을 하나씩 생성
gh label sync --file .github/labels.yml

if [ $? -eq 0 ]; then
    echo "✅ 라벨 설정 완료!"
    echo ""
    echo "📋 설정된 라벨 카테고리:"
    echo "  🚀 Phase Labels (phase-1 ~ phase-10)"
    echo "  🔄 TDD Cycle (tdd-red, tdd-green, tdd-refactor)"
    echo "  🏷️  Work Type (feat, fix, docs, test, etc.)"
    echo "  🚨 Priority (priority-high, priority-medium, priority-low)"
    echo "  📊 Status (status-ready, status-in-progress, etc.)"
    echo "  🧩 Component (component-collection, component-tab, etc.)"
    echo "  💻 Technical (typescript, react, testing, etc.)"
    echo ""
    echo "🎯 다음 단계:"
    echo "  1. GitHub 저장소에서 라벨이 올바르게 생성되었는지 확인"
    echo "  2. 새 이슈 생성 시 적절한 라벨 자동 적용 확인"
    echo "  3. PR 생성 시 연관 이슈 라벨 동기화 확인"
else
    echo "❌ 라벨 설정 실패. GitHub CLI 권한을 확인해주세요."
    exit 1
fi