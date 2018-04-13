pipeline {
  agent any
   parameters {
        choice(choices: "$environment", description: '', name: 'ENVIRONMENT')
        string(defaultValue: "$emailRecipients",
                description: 'List of email recipients',
                name: 'EMAIL_RECIPIENTS')
    }
  stages {
    stage("Build Image") {
      steps {
        //send Slack Notification to SS channel
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
        }
      }
    }
    //stage
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
    stage('User Input') {
            // when directive allows the Pipeline to determine whether the stage should be executed depending on the given condition
            // built-in conditions - branch, expression, allOf, anyOf, not etc.
            when {
                // Execute the stage when the specified Groovy expression evaluates to true
                expression {
                    return params.ENVIRONMENT ==~ /(?i)(STG|PRD)/
                }
            }
            /**
             * steps section defines a series of one or more steps to be executed in a given stage directive
             */
            steps {
                // script step takes a block of Scripted Pipeline and executes that in the Declarative Pipeline
                script {
                    // This step pauses Pipeline execution and allows the user to interact and control the flow of the build.
                    // Only a basic "process" or "abort" option is provided in the stage view
                    input message: '', ok: 'Proceed',
                            parameters: [
                                    string(name: '', description: ''),
                            ]
                }
            }
        }

  }
 
}
