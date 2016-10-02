# Custom Lambda Authorizer for ApiGateway using Node and Promise Pattern
Enables API Authorization using Bearer Tokens from Google, Facebook and Amazon Id Providers.

## Authors
[Meghan Erickson](https://www.linkedin.com/in/meghanerickson)

[James Shank](https://www.linkedin.com/in/james-shank)

[Ryan Scott](https://www.linkedin.com/in/ryanwscott)

## External Resources
[AWS Authorizer Blueprints](https://github.com/awslabs/aws-apigateway-lambda-authorizer-blueprints)

[Lambda Unit Testing - Callback Pattern](https://github.com/vandium-io/lambda-tester/blob/master/docs/main.md)

[Lambda Support for Node and Promises](https://blogs.aws.amazon.com/javascript/post/Tx3BZ2DC4XARUGG/Support-for-Promises-in-the-SDK)

[ES6 Promise Documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

## Working in this project

### Imported Libs
You can create additional imports in the `lib/` directory. The `lib/` will be included in the deployed artifact.

### Testing
Testing is done with [Mocha](https://mochajs.org).

```bash
$ npm install -g mocha
$ npm install
$ npm test
```

### Building
The project contains a npm script `build`. This script will create an archive (zip) that can be uploaded to S3.

```bash
$ npm run build
```

## How Lambda custom authorizer's work

### Input to Lambda function (as an event)
When AWS invokes a Lambda function as an `authorizer` the following JavaScript object is passed to the function as the `event`.

```JavaScript
{
  type: "TOKEN",
  authorizationToken: "<caller-supplied-token>",
  methodArn: "arn:aws:execute-api:<regionId>:<accountId>:<apiId>/<stage>/<method>/<resourcePath>"
}
```

### Output from Lambda function (IAM Policy)
The output of a custom authorizer should be an AWS IAM Policy. The policy should described the level of access the caller is allowed.
This policy is also able to be cached in API Gateway for up to 300 seconds.

```JavaScript
{
    "principalId": "xxxxxxxx",
    "policyDocument": {
      "Version": "2012-10-17",
      "Statement": [{
        "Effect": "Allow",
        "Action": [
          "execute-api:Invoke"
        ],
        "Resource": [
          "arn:aws:execute-api:{region}:{accountId}:{apiId}/*/GET/"
        ]
      }]
    }
}
```

### Lambda Authorizer Configuration
There are a few notable configurations for a custom authorizer.

1. Execution Role. This should be an IAM Role with access to invoke a Lambda function.
```
arn:aws:iam::<accoundId>:role/lambda-invoke
```
2. Identity Token Source. This is where API Gateway looks for the incoming bearer token on the request.
```
method.request.header.Authorization
```

## Identity Provider Contracts
Each of the supported identity providers have their contracts described below.

### Google
[Google TokenInfo Contract](https://developers.google.com/identity/sign-in/web/backend-auth#verify-the-integrity-of-the-id-token)

Valid Token Information Response
```JavaScript
curl -X GET https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=foo
200 OK
{
 "iss": "accounts.google.com",
 "at_hash": "Tyxxxxx_xxx-xxxxxxx",
 "aud": "blah-blah.apps.googleusercontent.com", //clientId proving call was made from our app
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

Invalid Token Information Response
```JavaScript
curl -X GET https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=foo
400 Bad Request
{
 "error_description": "Invalid Value"
}
```

### Amazon
[Login with Amazon](https://login.amazon.com/website)

There are two steps required to `Login with Amazon`. Step one starts upon receiving a token from the client.

1. Pass the client token to the Token API. This step is used to verify the client identifier the token was created with.
2. Pass the client token to the Profile API. This step is used to retrieve the user's profile information.

The `best practice` is to make the first call and fail fast if the client identifier does not validate.

Amazon Token Response
```JavaScript
curl -X GET https://api.amazon.com/auth/o2/tokeninfo?access_token=foo
200 OK
{
  "app_id": "amzn1.application.identifier",
  "aud": "amzn1.application-oa2-client.identifier", //clientId proving call was made from our app
  "exp": 818,
  "iat": 1475349936,
  "iss": "https://www.amazon.com",
  "user_id": "amzn1.account.identifier"
}
```

Amazon Profile Response
```JavaScript
curl -X GET -H "Authorization: Bearer foo" https://api.amazon.com/user/profile
200 OK
{
  "email": "jenkypenky@gmail.com",
  "name": "Jenky Penky",
  "user_id": "amzn1.account.identifier"
}
```

### Facebook
TODO
