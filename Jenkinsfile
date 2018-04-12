pipeline {
    agent any
    stages {
        stage('Stage Build') {
            steps {
                 git url: 'https://github.com/lastessa/nodejs'
            }
        }

        // Build and Deploy to ACR 'stage'... 
        stage('Build and Push to DockerHUB Container Registry') {
            steps {
                app = docker.build('autocarmaua/nodejs')
                docker.withRegistry('https://index.docker.io/v1/', 'fd057578-f2ed-49af-9478-c94395fd8634') {
                app.push("${env.BUILD_NUMBER}")
                app.push('latest')
                }
            }
        }
    }
}
