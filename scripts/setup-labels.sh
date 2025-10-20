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

# 새 라벨 생성
echo "🔄 새로운 라벨 생성 중..."

# Phase 라벨들
echo "  📋 Phase 라벨 생성..."
for i in {1..10}; do
    gh label create "phase-$i" --color "0052cc" --description "Phase $i: WBS Phase $i 작업" 2>/dev/null || echo "    - phase-$i 이미 존재하거나 생성 실패"
done

# TDD 사이클 라벨들
echo "  🔄 TDD 사이클 라벨 생성..."
gh label create "tdd-red" --color "d73a4a" --description "🔴 Red Phase - 실패 테스트 작성" 2>/dev/null || echo "    - tdd-red 이미 존재"
gh label create "tdd-green" --color "28a745" --description "🟢 Green Phase - 테스트 통과 구현" 2>/dev/null || echo "    - tdd-green 이미 존재"
gh label create "tdd-refactor" --color "0366d6" --description "🔵 Refactor Phase - 코드 품질 개선" 2>/dev/null || echo "    - tdd-refactor 이미 존재"

# 작업 타입 라벨들
echo "  🏷️ 작업 타입 라벨 생성..."
gh label create "feat" --color "a2eeef" --description "새로운 기능 개발" 2>/dev/null || echo "    - feat 이미 존재"
gh label create "fix" --color "d73a4a" --description "버그 수정" 2>/dev/null || echo "    - fix 이미 존재"
gh label create "docs" --color "0075ca" --description "문서 작업" 2>/dev/null || echo "    - docs 이미 존재"
gh label create "test" --color "ffd33d" --description "테스트 추가/수정" 2>/dev/null || echo "    - test 이미 존재"
gh label create "refactor" --color "fbca04" --description "리팩토링" 2>/dev/null || echo "    - refactor 이미 존재"

# 우선순위 라벨들
echo "  🚨 우선순위 라벨 생성..."
gh label create "priority-high" --color "d73a4a" --description "🔴 높은 우선순위" 2>/dev/null || echo "    - priority-high 이미 존재"
gh label create "priority-medium" --color "fbca04" --description "🟡 보통 우선순위" 2>/dev/null || echo "    - priority-medium 이미 존재"
gh label create "priority-low" --color "28a745" --description "🟢 낮은 우선순위" 2>/dev/null || echo "    - priority-low 이미 존재"

# 상태 라벨들
echo "  📊 상태 라벨 생성..."
gh label create "status-ready" --color "0e8a16" --description "작업 준비 완료" 2>/dev/null || echo "    - status-ready 이미 존재"
gh label create "status-in-progress" --color "fbca04" --description "진행 중" 2>/dev/null || echo "    - status-in-progress 이미 존재"
gh label create "status-blocked" --color "d73a4a" --description "블로킹됨" 2>/dev/null || echo "    - status-blocked 이미 존재"
gh label create "status-needs-review" --color "0366d6" --description "리뷰 필요" 2>/dev/null || echo "    - status-needs-review 이미 존재"

# 컴포넌트 라벨들
echo "  🧩 컴포넌트 라벨 생성..."
gh label create "component-collection" --color "c5def5" --description "컬렉션 관련" 2>/dev/null || echo "    - component-collection 이미 존재"
gh label create "component-tab" --color "c5def5" --description "탭 관련" 2>/dev/null || echo "    - component-tab 이미 존재"
gh label create "component-tag" --color "c5def5" --description "태그 관련" 2>/dev/null || echo "    - component-tag 이미 존재"
gh label create "component-search" --color "c5def5" --description "검색 관련" 2>/dev/null || echo "    - component-search 이미 존재"
gh label create "component-theme" --color "c5def5" --description "테마 관련" 2>/dev/null || echo "    - component-theme 이미 존재"
gh label create "component-ui" --color "c5def5" --description "UI 컴포넌트 관련" 2>/dev/null || echo "    - component-ui 이미 존재"

success_count=$?

if [ $success_count -eq 0 ]; then
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