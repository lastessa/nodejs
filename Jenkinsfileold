pipeline {
    agent any
    stages {
        stage('Stage Build') {
            steps {
                 git url: 'https://github.com/lastessa/nodejs'
            }
        }

        stage('Build and Push to DockerHUB Container Registry') {
            
            steps {
                 git url: 'https://github.com/lastessa/nodejs'
            }
        }

    }
}
