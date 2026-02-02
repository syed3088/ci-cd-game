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

                    echo "Server IP: ${SERVER_IP}"
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

                sh """
                echo "Copying website files..."
                scp -i ${KEY_PATH} -o StrictHostKeyChecking=no website/* \
                ubuntu@${SERVER_IP}:/tmp/
                """

                sh """
                echo "Replacing default nginx page..."
                ssh -i ${KEY_PATH} -o StrictHostKeyChecking=no ubuntu@${SERVER_IP} "
                sudo rm -f /var/www/html/index.nginx-debian.html &&
                sudo rm -f /var/www/html/index.html &&
                sudo mv /tmp/* /var/www/html/"
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
