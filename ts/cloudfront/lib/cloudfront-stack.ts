import {Aws, App, Stack, StackProps, RemovalPolicy} from '@aws-cdk/core';
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deploy from "@aws-cdk/aws-s3-deployment";
import * as route53 from "@aws-cdk/aws-route53";
import * as certificateManager from "@aws-cdk/aws-certificatemanager";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as iam from "@aws-cdk/aws-iam"
import * as cloudwatch from "@aws-cdk/aws-cloudwatch";
import * as targets from '@aws-cdk/aws-route53-targets';

export class CloudfrontStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "CDkCloudFrontS3", {
      bucketName: "cdk-cloudfront-s3",
    });

    new s3Deploy.BucketDeployment(this, "S3Deploy", {
      sources: [s3Deploy.Source.asset("./app/build")],
      destinationBucket: bucket

    })

    const domainName = "simply-serverless.com";
    const subDomainName = "cdk.simply-serverless.com";

    const zone = route53.HostedZone.fromLookup(this, "zone", {
      domainName: domainName,
    })

    const certificateArn = new certificateManager.DnsValidatedCertificate(this, "cdk-acm", {
      domainName: subDomainName,
      hostedZone: zone,
      region: "us-east-1",
    }).certificateArn;

    const identity = new cloudfront.OriginAccessIdentity(this, "id");

    bucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ["s3:GetObject"],
      resources: [bucket.arnForObjects("*")],
      principals: [new iam.CanonicalUserPrincipal(identity.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }))

    const viewCertificate = cloudfront.ViewerCertificate.fromAcmCertificate({
      certificateArn,
      env: {
        region: Aws.REGION,
        account: Aws.ACCOUNT_ID,
      },
      node: this.node,
      stack: this,
      applyRemovalPolicy(policy: RemovalPolicy): void {},
      metricDaysToExpiry: () => {
        return new cloudwatch.Metric({
          namespace: "cdk",
          metricName: "cdk",
        })
      }
    }, {
      sslMethod: cloudfront.SSLMethod.SNI,
      securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      aliases: [subDomainName],
    })

    const distribution = new cloudfront.CloudFrontWebDistribution(this, "cloudfront", {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: identity
          },
          behaviors: [
            {
              viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
              allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD,
              compress: true,
              isDefaultBehavior: true,
            }
          ]
        },
      ],
      viewerCertificate: viewCertificate,
      defaultRootObject: "index.html",
      errorConfigurations: [{
        errorCode: 403,
        responseCode: 200,
        responsePagePath: "/index.html",
      }]
    })

    new route53.ARecord(this, "a-record", {
      recordName: subDomainName,
      zone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
    })







  }
}
