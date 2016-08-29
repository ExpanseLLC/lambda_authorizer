# lamda_authorizor

## External Resources ##
[AWS Authorizor Blueprints](https://github.com/awslabs/aws-apigateway-lambda-authorizer-blueprints)

[Google TokenInfo Contract](https://david-codes.hatanian.com/2014/07/22/google-apis-checking-scopes-contained.html)

## Prerequisites
1. AWS-CLI
2. Access Keys to configure your CLI

## Imported Libs
You can create additional imports in the `lib/` directory. The `lib/` will be included in the deployed artifact.

## Testing
Testing is done with [Mocha](https://mochajs.org).

```
    $ npm install -g mocha
    $ npm install
    $ npm run lint
    $ npm test
```

## Building
The project contains a npm script `build`. This script will create an archive (zip) that can be uploaded to S3.

```
    $ npm run build
```

## Deployment
The ZIP file built by the `build` NPM task should be uploaded to S3. The [deploy-config.json](deploy-config.json) should 
be updated with the details for how the function should run in AWS. 

## Python (Boto)
Once the archive is uploaded to S3, you can use the [deploy.py](deploy.py) to deploy/update the function.

### Usage
```
    $ pip install -r requirements.txt
    
    $ python deploy.py --region us-west-2 --version {version}
    $ python deploy.py --profile aws-test --region us-west-2 --version {version}
```

### Full Example
```
    $ pip install -r requirements.txt
    
    $ npm test
    $ npm run build
    $ aws s3 cp lamda_authorizor-1.0.0.0.zip s3://example.bucket/lambda/lamda_authorizor/lamda_authorizor-1.0.0.0.zip
    $ python deploy.py --region us-west-2 --version 1.0.0.0
```
