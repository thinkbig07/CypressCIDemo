pipeline {
  agent any
  stages {
    stage('Dependencies') {
      steps {
        sh 'npm i'

      }
    }
    stage('Build') {
      steps {
        echo 'build process'
      }
    }
    stage('e2e Tests') {
      steps {
        sh 'npm run test'
      }
    }
  }
  tools {
    nodejs 'NodeJS 13'
  }
  environment {
    CHROME_BIN = '/bin/google-chrome'
  }
}
