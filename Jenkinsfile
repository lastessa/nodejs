pipeline {
    environment {
      DOCKER = credentials('fd057578-f2ed-49af-9478-c94395fd8634')
    }
  agent any
  stages {
// Building your Test Images
    stage('BUILD') {
      parallel {
        stage('Build Image') {
          steps {
          //withDockerRegistry([ credentialsId: "fd057578-f2ed-49af-9478-c94395fd8634", url: "https://index.docker.io/v1/" ]) {
          sh 'docker build -t autocarmaua/nodejs .'
          
        }
            
          }
        }
        stage('Test-Unit Image') {
          steps {
            sh 'echo parallel'
          }
        }
      }
      post {
        failure {
            echo 'This build has failed. See logs for details.'
        }
      }
    }
// Performing Software Tests
    stage('PUSH') {
      parallel {
        stage('Push Image to registry') {
          steps {
            withDockerRegistry([ credentialsId: "fd057578-f2ed-49af-9478-c94395fd8634", url: "https://index.docker.io/v1/" ]) {
            sh 'docker tag autocarmaua/nodejs index.docker.io/autocarmaua/nodejs:${env.BUILD_NUMBER}'
            sh 'docker tag autocarmaua/nodejs index.docker.io/autocarmaua/nodejs:latest'
            sh 'docker push index.docker.io/autocarmaua/nodejs:latest'
            }
          }
        }
        stage('Quality Tests') {
          steps {
            sh 'echo parallel 2'
            
          }
        }
      }
      post {
        success {
            echo 'Build succeeded.'
        }
        unstable {
            echo 'This build returned an unstable status.'
        }
        failure {
            echo 'This build has failed. See logs for details.'
        }
      }
    }
// Deploying your Software
    stage('DEPLOY') {
          when {
           branch 'master'  //only run these steps on the master branch
          }
            steps {
                    retry(3) {
                        timeout(time:10, unit: 'MINUTES') {
                            sh 'docker tag nodeapp-dev:trunk <DockerHub Username>/nodeapp-prod:latest'
                            sh 'docker push <DockerHub Username>/nodeapp-prod:latest'
                            sh 'docker save <DockerHub Username>/nodeapp-prod:latest | gzip > nodeapp-prod-golden.tar.gz'
                        }
                    }

            }
            post {
                failure {
                    sh 'docker stop nodeapp-dev test-image'
                    sh 'docker system prune -f'
                    deleteDir()
                }
            }
    }
// JUnit reports and artifacts saving
    stage('REPORTS') {
      steps {
        junit 'reports.xml'
        archiveArtifacts(artifacts: 'reports.xml', allowEmptyArchive: true)
        archiveArtifacts(artifacts: 'nodeapp-prod-golden.tar.gz', allowEmptyArchive: true)
      }
    }
// Doing containers clean-up to avoid conflicts in future builds
    stage('CLEAN-UP') {
      steps {
        sh 'docker stop nodeapp-dev test-image'
        sh 'docker system prune -f'
        deleteDir()
      }
    }
  }
}
