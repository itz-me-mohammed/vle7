pipeline {
    agent any
    environment {
        IMAGE = "itsmohammed/sample-app:${BUILD_NUMBER}"
        COLOR = "green" // initial deployment will go to green
        DEPLOYMENTS = ["green": "sample-app-green", "blue": "sample-app-blue"]
    }
    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/itz-me-mohammed/vle7.git'
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
                script {
                    def deploymentName = COLOR == "green" ? "sample-app-green" : "sample-app-blue"

                    // Check if deployment exists
                    def exists = sh(
                        script: "kubectl get deployment ${deploymentName} --ignore-not-found",
                        returnStdout: true
                    ).trim()

                    if (exists) {
                        echo "Updating existing deployment $deploymentName"
                        sh "kubectl set image deployment/${deploymentName} sample-app=$IMAGE"
                    } else {
                        echo "Creating new deployment $deploymentName"
                        sh "kubectl apply -f deployment-${COLOR}.yaml"
                    }
                }
            }
        }

        stage('Switch Service') {
            steps {
                input message: "Switch traffic to $COLOR version?"
                sh """
                kubectl patch service sample-app-service -p '{"spec":{"selector":{"app":"sample-app","color":"$COLOR"}}}'
                """
            }
        }
    }
}
