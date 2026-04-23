pipeline {
    agent any

    environment {
        IMAGE = "yashasgowdads/my-node-app"
        TAG = "latest"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE:$TAG .'
            }
        }

        stage('Push Docker Image') {
            steps {
                sh 'echo "Docker push step later"'
            }
        }

        stage('Deploy with Helm') {
            steps {
                sh 'helm upgrade --install my-app ./my-app'
            }
        }
    }

    post {
        success {
            echo 'PIPELINE SUCCESS 🚀'
        }
        failure {
            echo 'PIPELINE FAILED ❌'
        }
    }
}