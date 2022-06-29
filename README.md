# Storage Gateway
[![serverless](https://img.shields.io/badge/serverless-3.19.0-FD5750?style=flat-square&logo=serverless)](https://www.serverless.com/)
[![typescript](https://img.shields.io/badge/typescript-4.7.4-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/DiegoVictor/storage-gateway/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
[![Run in Insomnia](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Storage%20Gateway&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDiegoVictor%2Fstorage-gateway%2Fmain%2FInsomnia_2022-06-19.json)

This project creates a Api Gateway Rest Api that servers as a proxy for S3, allowing you to download/view S3 files without the necessity of code a download feature, in other words, is not necessary a Lambda to be able to download a file, the whole process will be handled by AWS infrastructure.

![Infrastructure Diagram](https://raw.githubusercontent.com/DiegoVictor/storage-gateway/main/Storage%20Gateway.png)

## Table of Contents
* [Requirements](#requirements)
* [Installing](#installing)
  * [Configure](#configure)
    * [Binary Mime Types](#binary-mime-types)
* [Usage](#usage)
  * [Routes](#routes)
