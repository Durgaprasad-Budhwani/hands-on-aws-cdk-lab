import {Stack, StackProps, aws_lambda as lambda, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import {SqsEventSource} from "aws-cdk-lib/aws-lambda-event-sources";

export class DeployStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // sqs
    const queue = new sqs.Queue(this, 'DeployQueue', {
      queueName: "simply-serverless-local-sqs"
    });

    // lambda
    const queueHandler =  new lambda.Function(this, "helloSqs", {
      functionName: "helloSqs",
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../src'),
    })

    queueHandler.addEventSource(new SqsEventSource(queue, { batchSize: 3, maxBatchingWindow: Duration.seconds(20 )}));

    this.exportValue(queue.queueUrl, { name: 'queue' });
  }
}
