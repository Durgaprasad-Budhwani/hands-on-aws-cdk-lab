import {App, RemovalPolicy, Stack, StackProps} from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deploy from '@aws-cdk/aws-s3-deployment';

export class StaticWebsiteStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // s3
    const bucket = new s3.Bucket(this, "CDKSimplyServerless", {
      bucketName: `cdk-simply-serverless`,
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: 'index.html',
    });

    // Deployment
    new s3Deploy.BucketDeployment(this, "BucketDeploy", {
      sources: [s3Deploy.Source.asset("./dist")],
      destinationBucket: bucket
    });
  }
}
