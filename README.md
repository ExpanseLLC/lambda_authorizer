# lamda_authorizor

## External Resources ##
[AWS Authorizor Blueprints](https://github.com/awslabs/aws-apigateway-lambda-authorizer-blueprints)

[Google TokenInfo Contract](https://david-codes.hatanian.com/2014/07/22/google-apis-checking-scopes-contained.html)

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
    
### Example Output (Policy)
```JavaScript
    {
     "issued_to": "407408718192.apps.googleusercontent.com",
     "audience": "407408718192.apps.googleusercontent.com",
     "user_id": "1170123456778279183758",
     "scope": "https://www.googleapis.com/auth/userinfo.email",
     "expires_in": 3585,
     "email": "someone@yourdomain.com",
     "verified_email": true,
     "access_type": "offline"
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
 "aud": "blah-blah.apps.googleusercontent.com",
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
