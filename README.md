# Custom Lambda Authorizer for ApiGateway 
Enables API Authorization using Bearer Tokens from Google, Facebook and Amazon Id Providers.

## External Resources ##
[AWS Authorizor Blueprints](https://github.com/awslabs/aws-apigateway-lambda-authorizer-blueprints)

[Google TokenInfo Contract](https://developers.google.com/identity/sign-in/web/backend-auth#verify-the-integrity-of-the-id-token)

[Lambda Unit Testing](https://github.com/vandium-io/lambda-tester/blob/master/docs/main.md)

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

### Example Input to Lambda Function (event)
```JavaScript
    {
     "type":"TOKEN",
     "authorizationToken":"<caller-supplied-token>",
     "methodArn":"arn:aws:execute-api:<regionId>:<accountId>:<apiId>/<stage>/<method>/<resourcePath>"
    }
```
    
### Example Policy Built By Authorizer to be Cached in ApiGateway 
```JavaScript
{
    "principalId": "xxxxxxxx",
     "policyDocument": {
        "Version": "2012-10-17",
        "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "execute-api:Invoke"
            ],
             "Resource": [
                "arn:aws:execute-api:us-west-2:xxxxxxxxx:kvmxspwm7g/*/GET/"
            ]
        }
        ]
}
```

### Example Configuration
```
// Custom Authorizor Configs
// Execution Role: arn:aws:iam::<accoundId>:role/lambda-invoke
// Identity Token Source: method.request.header.Authorization
```

### Identity Provider Contracts
Google Valid Response
```JavaScript
curl -X GET https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=foo
200 OK
{
 "iss": "accounts.google.com",
 "at_hash": "Tyxxxxx_xxx-xxxxxxx",
 "aud": "blah-blah.apps.googleusercontent.com",  //clientId proving call was made from our app
 "sub": "xxxxx2166xxxxxxxxxxxx",
 "email_verified": "true",
 "azp": "blah-blah.apps.googleusercontent.com",
 "email": "foo.bar@gmail.com",
 "iat": "1xxxxxxxx6",
 "exp": "1xxxxxxxx6",
 "name": "M. L.E.",
 "picture": "https://lh3.googleusercontent.com/-vQx9v-Xoek0/XXXX/XXXX/XXXX/s96-c/photo.jpg",
 "given_name": "M.",
 "family_name": "L.E.",
 "locale": "en",
 "alg": "RS256",
 "kid": "a3225a704cfoobarxxxxxxce1c8612b"
}
```

Google Invalid Token Response
```JavaScript
curl -X GET https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=foo 
400 Bad Request
{
 "error_description": "Invalid Value"
}
```