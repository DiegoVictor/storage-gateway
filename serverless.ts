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
      StorageGatewayFolderProxyResource: {
        Type: "AWS::ApiGateway::Resource",
        Properties: {
          ParentId: {
            "Fn::GetAtt": ["StorageGatewayApi", "RootResourceId"],
          },
          PathPart: "{folder}",
          RestApiId: {
            Ref: "StorageGatewayApi",
          },
        },
      },
      StorageGatewayApiObjectProxyResource: {
        Type: "AWS::ApiGateway::Resource",
        Properties: {
          ParentId: {
            Ref: "StorageGatewayFolderProxyResource",
          },
          PathPart: "{object}",
          RestApiId: {
            Ref: "StorageGatewayApi",
          },
        },
      },
      StorageGatewayApiObjectProxyMethod: {
        Type: "AWS::ApiGateway::Method",
        DependsOn: ["StorageGatewayBucketRole"],
        Properties: {
          AuthorizationType: "NONE",
          ResourceId: {
            Ref: "StorageGatewayApiObjectProxyResource",
          },
          RestApiId: {
            Ref: "StorageGatewayApi",
          },
          HttpMethod: "GET",
          RequestParameters: {
            "method.request.path.folder": true,
            "method.request.path.object": true,
            "method.request.header.Accept": true,
          },
          MethodResponses: [
            {
              ResponseParameters: {
                "method.response.header.Content-Type": true,
                "method.response.header.Content-Length": true,
                "method.response.header.Timestamp": true,
                "method.response.header.Access-Control-Allow-Origin": true,
                "method.response.header.Access-Control-Allow-Headers": true,
                "method.response.header.Access-Control-Allow-Methods": true,
              },
              StatusCode: "200",
            },
          ],
          Integration: {
            Type: "AWS",
            IntegrationHttpMethod: "GET",
            Uri: "arn:aws:apigateway:${self:provider.region}:s3:path/{bucket}/{folder}/{object}",
            Credentials: {
              "Fn::GetAtt": ["StorageGatewayBucketRole", "Arn"],
            },
            RequestParameters: {
              "integration.request.path.bucket": "'${self:custom.bucketName}'",
              "integration.request.path.folder": "method.request.path.folder",
              "integration.request.path.object": "method.request.path.object",
              "integration.request.header.Accept":
                "method.request.header.Accept",
            },
            IntegrationResponses: [
              {
                ContentHandling: "CONVERT_TO_BINARY",
                ResponseParameters: {
                  "method.response.header.Content-Type":
                    "integration.response.header.Content-Type",
                  "method.response.header.Content-Length":
                    "integration.response.header.Content-Length",
                  "method.response.header.Timestamp":
                    "integration.response.header.Date",
                  "method.response.header.Access-Control-Allow-Origin": "'*'",
                  "method.response.header.Access-Control-Allow-Headers":
                    "'Content-Type,Content-Length'",
                  "method.response.header.Access-Control-Allow-Methods":
                    "'GET,OPTIONS'",
                },
                StatusCode: "200",
              },
            ],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
