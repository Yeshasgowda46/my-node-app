pipeline {
    agent any

    environment {
        IMAGE_NAME = "yashasgowdads/my-node-app"
        TAG = "latest"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'YOUR_GITHUB_REPO_URL'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$TAG .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withDockerRegistry([credentialsId: 'dockerhub-creds', url: '']) {
                    sh 'docker push $IMAGE_NAME:$TAG'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'helm upgrade --install my-app ./my-app'
            }
        }
    }

    post {
        success {
            echo 'Pipeline SUCCESS 🚀'
        }
        failure {
            echo 'Pipeline FAILED ❌'
        }
    }
}