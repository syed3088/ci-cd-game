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

                    echo "Server IP is: ${SERVER_IP}"
                }
            }
        }

        stage('Wait for EC2') {
            steps {
                echo "Waiting for EC2 to initialize..."
                sh 'sleep 60'
            }
        }

        stage('Install Nginx') {
            steps {
                sh """
                ssh -i ${KEY_PATH} -o StrictHostKeyChecking=no ubuntu@${SERVER_IP} \
                "sudo apt update && sudo apt install -y nginx"
                """
            }
        }

        stage('Deploy Website') {
            steps {
                sh '''
                echo "Current Directory:"
                pwd
                echo "Listing files:"
                ls -la
                echo "Listing website folder:"
                ls -la website
                '''

                sh """
                scp -i ${KEY_PATH} -o StrictHostKeyChecking=no website/* \
                ubuntu@${SERVER_IP}:/tmp/
                """

                sh """
                ssh -i ${KEY_PATH} -o StrictHostKeyChecking=no ubuntu@${SERVER_IP} "
                sudo mv /tmp/*.html /var/www/html/ &&
                sudo mv /tmp/*.css /var/www/html/ &&
                sudo mv /tmp/*.js /var/www/html/"
                """
            }
        }
    }

    post {
        success {
            echo "🎉 Deployment Successful!"
            echo "Open in browser: http://${SERVER_IP}"
        }
        failure {
            echo "❌ Deployment Failed. Check logs."
        }
    }
}
