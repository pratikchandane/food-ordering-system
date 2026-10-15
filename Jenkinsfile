pipeline {
    agent any

    environment {
        PORT = '3000'
    }

    stages {
        stage('GitHub Checkout') {
            steps {
                echo '===================================================='
                echo 'STAGE 1: GITHUB CHECKOUT'
                echo '===================================================='
                // Checks out the latest commit from the Git repository
                checkout scm
                echo 'Source code successfully retrieved from repository.'
            }
        }

        stage('Build') {
            steps {
                echo '===================================================='
                echo 'STAGE 2: BUILD'
                echo '===================================================='
                // Installs production & dev dependencies and verifies asset packaging
                bat 'npm install --prefer-offline'
                bat 'npm run build'
                echo 'Project build and dependency resolution completed.'
            }
        }

        stage('Automated Testing') {
            steps {
                echo '===================================================='
                echo 'STAGE 3: AUTOMATED TESTING'
                echo '===================================================='
                // Executes all 14 automated unit tests
                bat 'npm test'
                echo 'All automated unit tests passed with 0 failures.'
            }
        }

        stage('Code Quality Check') {
            steps {
                echo '===================================================='
                echo 'STAGE 4: CODE QUALITY CHECK'
                echo '===================================================='
                // Runs static syntax analysis and architectural quality checks
                bat 'npm run quality'
                echo 'Code quality analysis passed all standards.'
            }
        }

        stage('Deployment') {
            steps {
                echo '===================================================='
                echo 'STAGE 5: DEPLOYMENT (LOCAL WINDOWS DEMO)'
                echo '===================================================='
                // Stops any previous instance on port 3000, starts the app in background, and verifies deployment
                bat '''
                    @echo off
                    echo [1/3] Checking for any running instance on port 3000...
                    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
                        echo Stopping old process PID %%a...
                        taskkill /F /PID %%a >nul 2>&1
                    )

                    echo [2/3] Launching application on port 3000...
                    set JENKINS_NODE_COOKIE=dontKillMe
                    start "FoodOrderingApp" /B node server.js

                    echo [3/3] Waiting for server warm-up and verifying health check...
                    powershell -NoProfile -Command "Start-Sleep -Seconds 4"
                    powershell -Command "try { $res = Invoke-RestMethod -Uri 'http://localhost:3000/api/health'; Write-Host ('[DEPLOYMENT VERIFIED] Status: ' + $res.status + ' - ' + $res.message) } catch { Write-Error 'Deployment verification failed'; exit 1 }"
                    if errorlevel 1 exit /b 1
                    
                    echo ====================================================
                    echo DEPLOYMENT SUCCESSFUL!
                    echo Access the live application at: http://localhost:3000
                    echo ====================================================
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline Execution Finished Successfully! All 5 stages green.'
        }
        failure {
            echo 'Pipeline Execution Failed! Check the stage logs above for errors.'
        }
    }
}
