cdklcoal synth

sam local generate-event sns notification
sam local invoke -t cdk.out/SnsDeployStack.template.json -e ../events/sns.json helloSns

cdklocal bootstrap
cdklocal deploy
awslocal sqs send-message --queue-url http://localhost:4566/000000000000/simply-serverless-local-sqs --message-body 'Hello From CDK SQS'
awslocal logs tail /aws/lambda/helloSqs