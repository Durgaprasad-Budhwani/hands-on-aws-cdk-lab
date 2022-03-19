import {aws_lambda as lambda, aws_sns as sns, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {SnsEventSource} from "aws-cdk-lib/aws-lambda-event-sources";

export class DeployStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // sqs
    const topic = new sns.Topic(this, 'DeploySns', {
      displayName: "Simply Serverless Topic"
    });

    // lambda
    const snsHandler = new lambda.Function(this, "helloSns", {
      functionName: "helloSns",
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../src'),
    })

    snsHandler.addEventSource(new SnsEventSource(topic));
  }
}
