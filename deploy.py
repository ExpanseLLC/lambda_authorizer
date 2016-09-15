import argparse
import json
import logging

import boto3
import sys

logger = logging.getLogger(name='Deployer')
logger.setLevel(level=logging.INFO)
console = logging.StreamHandler(stream=sys.stdout)
console.setLevel(level=logging.INFO)
console.setFormatter(fmt=logging.Formatter('%(lineno)d in %(filename)s at %(asctime)s: %(message)s'))
logger.addHandler(console)


class Deployer:
    def __init__(self, profile, region, version):
        """
        Creates a new Deployer for pushing Lambda functions to AWS.
        :param profile: the AWS credentials profile
        :param region: the AWS region destinations
        :param version: the version to deploy
        """
        self.profile = profile
        self.region = region
        self.version = version
        self.config = load_configuration()

    def deploy(self):
        logger.info("Starting deployment")

        # Create a Boto3 session, additional 'clients' will use the session to start their configuration
        if self.profile:
            session = boto3.Session(profile_name=self.profile)
        else:
            session = boto3.Session()

        # Get a client for Lambda
        aws_lambda = session.client('lambda')

        func_name = self.config['Name']
        func_archive_name = func_name + '-' + self.version + '.zip'

        # Check if the lambda function has already been deploy (needs update)
        if lambda_exists(client=aws_lambda, name=func_name):
            # Update code for the function
            logger.info("Deploying new code for function: %s", func_name)
            try:
                update_response = aws_lambda.update_function_code(
                    FunctionName=self.config['Name'],
                    S3Bucket=self.config['S3Bucket'],
                    S3Key=self.config['S3Context'] + func_archive_name
                )

                logger.info("Updated code for function: %s", update_response['FunctionArn'])
            except:
                logger.error("Failed to update function: %s, error: %s", func_name, sys.exc_info()[0])
                raise
        else:
            # Deploy a new function
            logger.info("Deploying new function: %s", func_name)
            try:
                create_response = aws_lambda.create_function(
                    FunctionName=self.config['Name'],
                    Runtime='nodejs4.3',
                    Role=get_iam_role(session, self.config['Role']),
                    Handler=self.config['Handler'],
                    Code={
                        'S3Bucket': self.config['S3Bucket'],
                        'S3Key': self.config['S3Context'] + func_archive_name
                    },
                    Description='lamda_authorizer Node.js function',
                    Timeout=self.config['Timeout'],
                    MemorySize=self.config['Memory']
                )

                logger.info("Created Lambda function: %s", create_response['FunctionArn'])
            except:
                logger.error("Failed to create function: %s, error: %s", func_name, sys.exc_info()[0])
                raise


def load_configuration():
    """
    Loads the supported configuration files.
    :return:
    """
    with open('./deploy-config.json') as data_file:
        config = json.load(data_file)

    return config


def lambda_exists(client, name):
    """
    Checks if a lambda function exists in AWS
    :param client: the boto3 lambda client
    :param name: the lambda function name
    :rtype: bool
    """
    response = client.list_functions()
    functions = response.get('Functions')
    for function in functions:
        if function['FunctionName'] == name:
            return True

    return False


def get_iam_role(session, name):
    """
    Retrieves the ARN of a IAM role in AWS.
    :param session: the boto3 session
    :param name: the name of the IAM Role
    :return: string
    """
    aws_iam = session.resource('iam')
    role = aws_iam.Role(name)
    logger.info("Using role: %s", role.arn)

    return role.arn


parser = argparse.ArgumentParser(description="Deployer for Lambda functions")
parser.add_argument('--profile', action='store', dest='profile', required=False, default=None,
                    help='AWS credentials profile')
parser.add_argument('--region', action='store', dest='region', required=True, help='AWS region')
parser.add_argument('--version', action='store', dest='version', required=True, help='Version to deploy')

args = parser.parse_args()

deployer = Deployer(profile=args.profile, region=args.region, version=args.version)

deployer.deploy()
