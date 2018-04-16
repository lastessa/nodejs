pipeline {
  agent any
  
 stages {


   // stage('Decide tag on Docker Hub') {
   //   agent none
    //  steps {
    //   script {
    //                env.RELEASE_SCOPE = input message: 'User input required', ok: 'Release!',
    //                        parameters: [choice(name: 'RELEASE_SCOPE', choices: 'patch\nminor\nmajor', description: 'What is the release scope?')]
    //            }
    //            echo "${env.RELEASE_SCOPE}"
   // }
 // }


    stage("Build Image") {
      steps {
        //send Slack Notification to SS channel with tag asd
        slackSend (color: '#FFFF00', message: "STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
        
        script {
                app = docker.build('autocarmaua/nodejs')
                docker.withRegistry('https://index.docker.io/v1/', 'fd057578-f2ed-49af-9478-c94395fd8634') {
                app.push("${env.BUILD_NUMBER}")
                app.push('latest')
			//echo "${TAG_VERSION}"
                }
        }
      }
    }
    stage("Tunnel into Swarm") {
      when {
        // skip this stage unless on Master branch test tagtest
    
        branch "master"
      }
      steps {
        script {
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
           sh 'ip ad sh'
        }
      }
    }
    //stage step
    stage("Deploy And Update Swarm") {
	    when {
	    	branch "master"
	    }
    steps {
      script {
         sh "echo starting deploy"	  
           app = docker.image('autocarmaua/nodejs:latest')
           docker.withRegistry('https://index.docker.io/v1/', 'fd057578-f2ed-49af-9478-c94395fd8634') {
           
		     
	        app.pull()
          //app.run('--name node-demo -p 80:8000')
          sh "docker service update --image autocarmaua/nodejs:latest node-js" 
          slackSend (color: '#66cd00', message: "SUCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
        }
      }
    }
    
    }
    //stage checking slave
    stage("Checking swarm slave") {
      when {
        // skip this stage unless on Master branch 
    
        branch "master"
      }
      steps {
        script {
            sshagent(['15783b26-1be2-42ee-9acc-b2d310d379d9']) {
              sh 'ssh -o StrictHostKeyChecking=no root@mongo-master.konverter.com.ua uname -a'
              sh 'ssh -o StrictHostKeyChecking=no root@mongo-master.konverter.com.ua ip ad sh'
                }
               
          
        }
      }
    }
    
    

  }
 
}
