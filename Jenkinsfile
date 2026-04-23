pipeline {
    agent any

    environment {
        IMAGE = "yashasgowdads/my-node-app"
        TAG = "latest"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE:$TAG ./server'
            }
        }

        stage('Push Docker Image') {
            steps {
                sh 'echo "Docker push step later"'
            }
        }

        stage('Deploy with Helm') {
    steps {
        echo "Helm deployment skipped for demo"
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