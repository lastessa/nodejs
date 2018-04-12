node {
    try {
        notifyBuild('STARTED')
    dir('demo node js') {
        
        // Mark the code checkout 'stage'....
        stage('Checkout from GitHub') {
            
            git url: 'https://github.com/lastessa/nodejs'
        }

        // Build and Deploy to ACR 'stage'... 
        stage('Build and Push to DockerHUB Container Registry') {
                app = docker.build('autocarmaua/nodejs')
                docker.withRegistry('https://index.docker.io/v1/', 'fd057578-f2ed-49af-9478-c94395fd8634') {
                app.push("${env.BUILD_NUMBER}")
                app.push('latest')
                }
        }

        stage('Open SSH Tunnel to Zimbra Swarm Cluster') {
                // Open SSH Tunnel to ACS Cluster
                sshagent(['d458a36c-e315-4411-9505-e19e7ba59575']) {
                    sh 'date'
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
       
        stage('Docker Pull and Update Swarm Cluster') {
            
           when {
		        branch 'master'
		    }
		  
           app = docker.image('autocarmaua/nodejs:latest')
           docker.withRegistry('https://index.docker.io/v1/', 'fd057578-f2ed-49af-9478-c94395fd8634') {
           app.pull()
           //app.run('--name node-demo -p 80:8000')
           sh "docker service update --image autocarmaua/nodejs:latest node-js" 
        }
      }
     
    }
        } catch (e) {
    // If there was an exception thrown, the build failed
    currentBuild.result = "FAILED"
    throw e
  } finally {
    // Success or failure, always send notifications
    notifyBuild(currentBuild.result)
  }
}
def notifyBuild(String buildStatus = 'STARTED') {
  // build status of null means successful
  buildStatus =  buildStatus ?: 'SUCCESSFUL'

  // Default values
  def colorName = 'RED'
  def colorCode = '#FF0000'
  def subject = "${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
  def summary = "${subject} (${env.BUILD_URL})"
  def details = """<p>STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
    <p>Check console output at: &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p>"""

  // Override default values based on build status
  if (buildStatus == 'STARTED') {
    color = 'YELLOW'
    colorCode = '#FFFF00'
  } else if (buildStatus == 'SUCCESSFUL') {
    color = 'GREEN'
    colorCode = '#00FF00'
  } else {
    color = 'RED'
    colorCode = '#FF0000'
  }

  // Send notifications
  slackSend (color: colorCode, message: summary)

  //emailext(
  //    subject: subject,
  //    body: details,
  //    recipientProviders: [[$class: 'DevelopersRecipientProvider']]
  //  )
}
def gitCheckThatOut(String branch, String vcsUrl) {
    branch =  branch ?: 'master'
    // cleanup
    gitClean()
    // checkout
    git branch: "${branch}", url: "${vcsUrl}"
    // get last tag
    sh "git describe --abbrev=0 --tags > .git/tagName"
    tagName = readFile('.git/tagName')
    echo "${tagName}"
    // set DisplayName
    currentBuild.displayName = tagName
}
