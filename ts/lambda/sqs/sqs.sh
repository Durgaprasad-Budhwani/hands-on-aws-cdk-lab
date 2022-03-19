cdklcoal synth

sam local generate-event sqs receive-message
sam local invoke -t cdk.out/SnsDeployStack.template.json -e ../events/sns.json helloSns

cdklocal bootstrap
cdklocal deploy
aws local sns list-topics
awslocal sns publish --topic-arn arn:aws:sns:us-east-1:000000000000:SnsDeployStack-DeploySns3F65B0E4-c1561abf --message 'Hello From CDK SNS'
awslocal logs tail /aws/lambda/helloSns