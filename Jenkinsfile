pipeline {
    agent any

    environment {
        KEY_PATH = "/var/lib/jenkins/jenkins-kp.pem"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Terraform Init') {
            steps {
                dir('terraform') {
                    sh 'terraform init'
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                dir('terraform') {
                    sh 'terraform apply -auto-approve'
                }
            }
        }

        stage('Get Public IP') {
            steps {
                script {
                    env.SERVER_IP = sh(
                        script: "cd terraform && terraform output -raw public_ip",
                        returnStdout: true
                    ).trim()
                }
            }
        }

        stage('Wait for EC2') {
            steps {
                sh 'sleep 60'
            }
        }

        stage('Install Nginx') {
            steps {
                sh '''
                ssh -i ${KEY_PATH} -o StrictHostKeyChecking=no ubuntu@${SERVER_IP} \
                "sudo apt update && sudo apt install nginx -y"
                '''
            }
        }

        stage('Deploy Game') {
    steps {
        sh '''
        pwd
        ls -la
        ls -la website || true
        '''
        
        sh '''
        scp -i ${KEY_PATH} -o StrictHostKeyChecking=no ./website/* \
        ubuntu@${SERVER_IP}:/tmp/
        '''

        sh '''
        ssh -i ${KEY_PATH} -o StrictHostKeyChecking=no ubuntu@${SERVER_IP} "
        sudo mv /tmp/*.html /var/www/html/
        sudo mv /tmp/*.css /var/www/html/
        sudo mv /tmp/*.js /var/www/html/"
        '''
    }
}


    }

    post {
        success {
            echo "Infrastructure created and game deployed successfully!"
        }
    }
}
