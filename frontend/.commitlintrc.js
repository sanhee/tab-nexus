export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 새로운 기능
        'fix',      // 버그 수정
        'docs',     // 문서 변경
        'style',    // 코드 포맷팅 (세미콜론 누락, 등)
        'refactor', // 리팩토링
        'test',     // 테스트 추가/수정
        'chore',    // 빌드 도구, 의존성 등
        'perf',     // 성능 개선
        'ci',       // CI 설정
        'build',    // 빌드 시스템
        'revert'    // 커밋 되돌리기
      ]
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 100],
  }
};