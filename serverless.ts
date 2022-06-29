import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "storage-gateway",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "us-east-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  package: { individually: true },
  custom: {
    bucketName: "storage-gateway-${sls:stage}-bucket",
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      StorageGatewayBucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: "${self:custom.bucketName}",
        },
      },
      StorageGatewayBucketRole: {
        Type: "AWS::IAM::Role",
        DependsOn: ["StorageGatewayBucket"],
        Properties: {
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Service: ["apigateway.amazonaws.com"],
                },
                Action: ["sts:AssumeRole"],
              },
            ],
          },
          Policies: [
            {
              PolicyName: "ReadBucket",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: ["s3:Get*", "s3:List*"],
                    Resource: {
                      "Fn::Join": [
                        "",
                        [
                          { "Fn::GetAtt": ["StorageGatewayBucket", "Arn"] },
                          "/*",
                        ],
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      StorageGatewayApi: {
        Type: "AWS::ApiGateway::RestApi",
        Properties: {
          Name: "StorageGatewayApi",
          BinaryMediaTypes: ["image/jpeg", "image/png", "image/gif"],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
