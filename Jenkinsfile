pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'test -f index.html'
                sh 'test -f style.css'
                sh 'test -f script.js'
            }
        }

        stage('Test') {
            steps {
                echo 'Attendance project files verified successfully.'
            }
        }

        stage('Package') {
            steps {
                echo 'Smart Attendance project is ready.'
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded.'
        }

        failure {
            echo 'Pipeline failed.'
        }
    }
}