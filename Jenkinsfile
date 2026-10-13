// ============================================================
// DangCharge FE CI Pipeline
//
// 실행 범위
//   - 개발 브랜치 → development PR : Install → Lint → Build
//   - development → main PR     : Install → Lint → Build
//   - development/main 머지      : Install → Lint → Build
//
// PR/브랜치 탐색은 Jenkins Multibranch Job에서 설정한다.
// 머지 차단은 GitHub에서 development와 main 각각에 Jenkins 상태 검사를 필수로 지정한다.
// 배포는 Cloudflare가 담당하며, 현재 FE에는 테스트 스크립트가 없다.
// 필요 플러그인: Pipeline, GitHub Branch Source, Docker Pipeline, Workspace Cleanup
// ============================================================
pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    timeout(time: 20, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  stages {
    // PR 또는 브랜치 이름을 빌드 목록에 표시한다.
    stage('Prepare') {
      steps {
        script {
          if (env.CHANGE_ID) {
            currentBuild.description = "PR #${env.CHANGE_ID}: ${env.CHANGE_BRANCH} → ${env.CHANGE_TARGET}"
          } else {
            currentBuild.description = "Branch: ${env.BRANCH_NAME}"
          }
        }
      }
    }

    // 빌드 도구 버전을 일정하게 유지하기 위해 Node 컨테이너에서 검사한다.
    stage('CI') {
      agent {
        docker {
          image 'node:24-bookworm-slim'
          reuseNode true
        }
      }

      stages {
        // package.json의 pnpm 버전과 잠금 파일에 맞춰 의존성을 설치한다.
        stage('Install') {
          steps {
            sh '''npm install --global "$(node -p 'require("./package.json").packageManager')"'''
            sh 'pnpm install --frozen-lockfile'
          }
        }

        // PR 머지 전에 ESLint 오류를 찾는다.
        stage('Lint') {
          steps {
            sh 'pnpm lint'
          }
        }

        // TypeScript 검사와 Vite 빌드를 실행하되, 배포는 하지 않는다.
        stage('Build') {
          steps {
            sh 'pnpm build'
          }
        }
      }
    }
  }

  post {
    // 빌드 성공 여부와 관계없이 작업 공간을 비운다.
    always {
      cleanWs()
    }
  }
}
