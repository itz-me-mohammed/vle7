pipeline {
    agent any
    environment {
        IMAGE = "itsmohammed/sample-app:${BUILD_NUMBER}"
        COLOR = "green" // initial deployment will go to green
    }
    stages {
        stage('Clone Repo') {
            steps {
                git 'https://github.com/itz-me-mohammed/vle7.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE .'
            }
        }

        stage('Push Image') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-pass', variable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u itsmohammed --password-stdin'
                    sh 'docker push $IMAGE'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl set image deployment/sample-app-$COLOR sample-app=$IMAGE --record'
            }
        }

        stage('Switch Service') {
            steps {
                input message: "Switch traffic to $COLOR version?"
                sh 'kubectl patch service sample-app-service -p "{\"spec\": {\"selector\": {\"app\": \"sample-app\", \"color\": \"$COLOR\"}}}"'
            }
        }
    }
}
