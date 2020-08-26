#!groovy

pipeline {
    agent any
    tools {
        maven 'maven3.6.3'
        jdk 'java8'
        }

    environment {
        //getting the current stable/deployed revision...this is used in undeloy.sh in case of failure...
        stable_revision = 'curl -H "Authorization: Basic "$BASE64"" "https://api.enterprise.apigee.com/v1/organizations/dayakarg-eval/apis/smart-comm-v2/deployments"'
    }

    stages {
       stage('Initial-Checks') {
       steps {
                bat "npm -v"
                bat "mvn -v"
                //echo "$apigeeUsername"
                //echo "Stable Revision: ${env.stable_revision}"
        }}  
        stage('Policy-Code Analysis') {
          steps {
             //  bat "npm install -g apigeelint"
               bat "C:/Users/pau_ganday/AppData/Roaming/npm/apigeelint -s smart-comm-v2/apiproxy/ -f codeframe.js"
            }
        }
      stage('Unit-Test-With-Coverage') {
      steps {
              script {
                   try {
                        //bat "npm install"
                        bat "npm test test/unit/*.js"
                     bat "npm run coverage test/unit/*.js"
                   } catch (e) {
                     throw e
                  } finally {
                  // bat "cd coverage && cp cobertura-coverage.xml 'C:/Program Files (x86)/Jenkins/workspace/Smart-comm-v2/'"
                     // bat([$class: 'CoberturaPublisher', coberturaReportFile: '**/cobertura-coverage.xml'])
                     cobertura autoUpdateHealth: false, autoUpdateStability: false, coberturaReportFile: '**/coverage/cobertura-coverage.xml', conditionalCoverageTargets: '70, 0, 0', failNoReports: false, failUnhealthy: false, failUnstable: false, lineCoverageTargets: '80, 0, 0', maxNumberOfBuilds: 0, methodCoverageTargets: '80, 0, 0', onlyStable: false, sourceEncoding: 'ASCII', zoomCoverageChart: false
                       
                    }
                }
            }
        } 
        /*stage('Promotion') {
            steps {
                timeout(time: 2, unit: 'DAYS') {
                    input 'Do you want to Approve?'
                }
            }
        }*/
        stage('Deploy to test') {
            steps {
                 //deploy using maven plugin
                 
                 // deploy only proxy and deploy both proxy and 	config based on edge.js update
                //	bat "sh && sh deploy.sh"
             //   bat "mvn -f smart-comm-v2/pom.xml install -Ptest -Dusername=${apigeeUsername} -Dpassword=${apigeePassword} -Dapigee.config.options=update"
                sh "mvn -f smart-comm-v2/pom.xml -X install -Pprod -Dusername=${apigeeUsername} -Dpassword=${apigeePassword} -Dhttps.proxyHost=ukdcproxy -Dhttps.proxyPort=80 -Dapigee.config.options=update"
                
            }
        }
        stage('Integration Tests') {
            steps {
              //  bat 'C:/Users/pau_ganday/AppData/Roaming/npm/newman run "Quilter-POC.postman_collection_v1.0" -r junitfull --reporter-junitfull-export "./newman/postman-report.xml" -n 2'
    script {       
	try {
		//bat 'C:/Users/pau_ganday/AppData/Roaming/npm/newman run "Quilter-POC.postman_collection_v1.0" -r htmlextra'
		bat 'C:/Users/pau_ganday/AppData/Roaming/npm/newman run "Quilter-POC.postman_collection_v1.0" -r junitfull --reporter-junitfull-export "./newman/postman-report.xml" -n 2'
         } catch (err) {
            if (currentBuild.result == 'UNSTABLE')
                currentBuild.result = 'FAILURE'
            throw err
        } 
	    finally {
           step([$class: 'JUnitResultArchiver', testResults: '**/newman/postman-report.xml', healthScaleFactor: 1.0])
          publishHTML (target: [
                   allowMissing: false,
                 alwaysLinkToLastBuild: false,
                   keepAll: true,
                    reportDir: 'newman',
                 reportFiles: 'postman-report.xml',
                  reportName: "Junit Report"
             ])
        }
		}
    }
            }
                                       
             }
        }
