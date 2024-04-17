# Storage Gateway
[![serverless](https://img.shields.io/badge/serverless-3.38.0-FD5750?style=flat-square&logo=serverless)](https://www.serverless.com/)
[![typescript](https://img.shields.io/badge/typescript-5.4.5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/storage-gateway/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
[![Run in Insomnia](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Storage%20Gateway&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDiegoVictor%2Fstorage-gateway%2Fmain%2FInsomnia_2022-06-19.json)

This project creates a Api Gateway Rest Api that serves as a proxy for S3, allowing you to download/view S3 files without the necessity of a download feature, in other words, is not necessary a Lambda to be able to download a file, the whole process will be handled by AWS infrastructure.

![Infrastructure Diagram](https://raw.githubusercontent.com/DiegoVictor/storage-gateway/main/Storage%20Gateway.png)

## Table of Contents
* [Requirements](#requirements)
* [Installing](#installing)
  * [Configure](#configure)
    * [Binary Mime Types](#binary-mime-types)
* [Usage](#usage)
  * [Routes](#routes)
* [References](#references)

# Requirements
* Node.js ^14.15.0
* AWS Account 
  * [API Gateway](https://aws.amazon.com/api-gateway/)
  * [S3](https://aws.amazon.com/s3/)

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```

## Configure
If you need change the bucket name for any reason remember to update the `custom.bucketName` in the `serverless.ts` file.

### Binary Mime Types
If necessary more binary types add it in the `StorageGatewayApi.Properties.BinaryMediaTypes` array in the `serverless.ts`.

# Usage
Deploy the project running the following command:
```
$ sls deploy --stage dev
```
Now run the `scripts/main.js` script to upload some sample files:
```
$ node scripts/main.js
```
Then [get the application Rest API URL](https://docs.aws.amazon.com/pt_br/apigateway/latest/developerguide/how-to-call-api.html#apigateway-how-to-call-rest-api).

## Routes
|route|HTTP Method
|:---|:---:
|`/images/blown.gif`|GET
|`/images/programming.jpg`|GET
|`/images/works.png`|GET

Below you can see the path structure:
```
/{folder}/{filename}
```
* `/images` is the name of the folder where the samples were uploaded.
* The second part (`/blown.gif`, `/programming.jpg` and `/works.png`) is the name of the files.

# References
* [Tutorial: Create a REST API as an Amazon S3 proxy in API Gateway
PDF
RSS](https://docs.aws.amazon.com/apigateway/latest/developerguide/integrating-api-with-aws-services-s3.html)
