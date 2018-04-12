node {
    dir('demo node js') {
        // Mark the code checkout 'stage'....
        stage('Checkout from GitHub') {
            git url: 'https://github.com/lastessa/nodejs'
        }

        // Build and Deploy to ACR 'stage'... 
        stage('Build and Push to Zimbra Container Registry') {
                app = docker.build('autocarmaua/nodejs')
                docker.withRegistry('https://index.docker.io/v1/', 'fd057578-f2ed-49af-9478-c94395fd8634') {
                app.push("${env.BUILD_NUMBER}")
                app.push('latest')
                }
        }

        stage('Open SSH Tunnel to Zimbra Swarm Cluster') {
                // Open SSH Tunnel to ACS Cluster
                sshagent(['d458a36c-e315-4411-9505-e19e7ba59575']) {
                    sh 'ssh -vvv -o StrictHostKeyChecking=no root@zimbra.konverter.com.ua uname -a'
                    sh 'ssh -fNL 2375:localhost:2375 -p 22 root@zimbra.konverter.com.ua -o StrictHostKeyChecking=no -o ServerAliveInterval=240 && echo "ACS SSH Tunnel successfully opened..."'
                }
                // Check tunnel is open and set DOCKER_HOST env var
           //env.DOCKER_HOST=':2375'
           env.DOCKER_HOST='unix:///var/run/docker.sock'
           sh 'echo "DOCKER_HOST is $DOCKER_HOST"'
           sh 'docker info'
        }

        // Pull, Run, and Test on ACS 'stage'... 
        stage('ACS Docker Pull and Run') {
           app = docker.image('autocarmaua/nodejs:latest')
           docker.withRegistry('https://index.docker.io/v1/', 'fd057578-f2ed-49af-9478-c94395fd8634') {
           app.pull()
           //app.run('--name node-demo -p 80:8000')
           sh "docker service update \
            --image autocarmaua/nodejs:latest \
            node-js"
            }
        }
    }
}
