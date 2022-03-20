cdklcoal synth

sam local start-api -t cdk.out/APIGatewayDeployStack.template.json

cdklocal bootstrap
cdklocal deploy

curl --request POST 'https://v14zaoqsk9.execute-api.localhost.localstack.cloud:4566/prod/'
