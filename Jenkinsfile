def helm_install(){
    sh 'mkdir ~/.kube'
    sh 'aws s3 cp s3://cent-general-k8s-secrets/aws-eks-kubecfg/eks-${ENV}.kubecfg ~/.kube/config '
    sh 'kubectl create namespace ${NAMESPACE} | true'
    sh 'helm ls -n ${NAMESPACE} | true'
    sh 'kubectl create secret generic "${SERVICE_NAME}-secrets" --from-file=secrets.json="${BLANK_SECRET_FN}" --namespace="${NAMESPACE}" | true'
    sh 'kubectl delete configmap "${SERVICE_NAME}-settings" --namespace=${NAMESPACE} | true'
    sh 'kubectl create configmap "${SERVICE_NAME}-settings" --from-file=appsettings.json="helm/${ENV}-${SERVICE_NAME}-settings.json" --namespace=${NAMESPACE}'
    sh 'helm upgrade --install ${SERVICE_NAME}-release helm -f helm/${ENV}-values.yaml -n ${NAMESPACE} --debug --set k8s_platform=eks --set namespace=${NAMESPACE} --set hostname=${HOSTNAME} --set image.tag=1.0.${BUILD_NUMBER}'

}

pipeline {
    agent {
        label 'linux-agent2'
    }

    environment {
        NAMESPACE = 'cennzx-ui'
        BLANK_SECRET_FN = 'helm/blank-secret.json'
        SERVICE_NAME    = 'cennzx-ui'
        CONFIGMAP       = 'cennzx-ui-settings'
        SECRETS_NAME    = 'cennzx-ui-secrets'
        IMAGE_NAME="centrality/${SERVICE_NAME}:1.0.${BUILD_NUMBER}"
    }

    stages {
        stage('Build and Publish image') {
            steps {
                script{
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-account-for-cennznet', usernameVariable: 'NUSER', passwordVariable: 'NPASS')]) {
                        sh 'docker login -u ${NUSER} -p ${NPASS}'
                        def customImage = docker.build("cennznet/${SERVICE_NAME}:1.0.${env.BUILD_ID}")
                        customImage.push()
                        customImage.push('latest')
                    }

                }
            }
        }


        stage('-- [DEV] -- Deploy to K8S') {
            environment {
                ENV = 'dev'
                HOSTNAME = 'service.eks.centrality.me'
                MY_VARIABLE = 'XYZ'
            }
            when {
                not {
                    anyOf {
                        branch 'master';
                        branch 'feature/fake-master-new'
                    }
                }
            }
            agent {
                docker {
                    image 'maochuanli/debian-buster:latest'
                    label 'linux'
                }
            }
            steps{
                helm_install()
            }
            
        }

        stage ('Confirm [PROD] Deployment') {
            when {
                branch 'feature/fake-master-new'
            }
            steps {
                timeout(unit: 'SECONDS', time: 180) {
                    input "Confirm PROD deploy?"
                }
            }
        }

        stage('-- [PROD] -- Deploy to K8S') {
            when {
                branch 'feature/fake-master-new'
            }
            environment {
                ENV = 'prod'
                HOSTNAME = 'cennzx.io'
            }

            agent {
                docker {
                    image 'maochuanli/debian-buster:latest'
                    label 'linux'
                }
            }
            steps{
                helm_install()
            }
            
        }

    }

    post {
        always {
            sh 'bash /mnt/jenkins/script/cleanup.sh'
        }
    }
}
