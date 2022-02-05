import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { join } from "path";

export class HelloWorldStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new NodejsFunction(this, "HelloLambda", {
      functionName: "HelloLambda",
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: join(__dirname, "..", "src", "index.ts"),
      bundling: {
        externalModules: [
          'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
        ],
      },
      depsLockFilePath: join(__dirname, "..", 'package-lock.json'),
    })
  }
}
