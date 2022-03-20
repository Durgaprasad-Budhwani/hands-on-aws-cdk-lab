import { Stack, StackProps, aws_apigateway as apigateway, aws_lambda as lambda } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class DeployStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // lambda
    const apiHandler = new lambda.Function(this, "helloApi", {
      functionName: "helloApi",
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../src'),
    })

    const api = new apigateway.RestApi(this, "simply-serverless-api", {
      restApiName: "Simply Serverless Service",
    });

    const apiIntegration = new apigateway.LambdaIntegration(apiHandler, {
      proxy: true,
    })

    api.root.addMethod("GET", apiIntegration);
    api.root.addMethod("POST", apiIntegration);

  }
}
