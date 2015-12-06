var pkg = require('./package.json');
var fs = require('fs');
var AWS = require('aws-sdk');
if (typeof AWS.config.region !== 'string') {
    console.error('No region found, defaulting to eu-west-1');
    AWS.config.update({ region: 'eu-west-1' }); 
}

var region = AWS.config.region;
var cloudFormation = new AWS.CloudFormation();
var ec2 = new AWS.EC2();

var stackName = pkg.config.testStackName;
var keyName = stackName + 'Key';
var templateFile = 'testStack.json';

fs.readFile(templateFile, 'utf8', function(err, template) {
    var params = {
      StackName: stackName, /* required */
      Capabilities: [
        'CAPABILITY_IAM',
      ],
      NotificationARNs: [
        /* more items */
      ],
      OnFailure: 'ROLLBACK',
      Parameters: [
        {
          ParameterKey: 'DBPassword',
          ParameterValue: 'abcdefg1234567',
          UsePreviousValue: false
        },
        {
          ParameterKey: 'DBRootPassword',
          ParameterValue: 'abcdefg1234567',
          UsePreviousValue: false
        },
        {
          ParameterKey: 'KeyName',
          ParameterValue: keyName,
          UsePreviousValue: false
        },
        {
          ParameterKey: 'DBUser',
          ParameterValue: 'DBUser',
          UsePreviousValue: false
        }
      ],

      Tags: [
      ],
      TemplateBody: template,
      TimeoutInMinutes: 5
    };

    console.log('Create EC2 KeyPair for stack: ' + keyName);
    ec2.createKeyPair({
        KeyName: keyName
    }, function(err, data) {

        if (err) {
            console.log('ERROR: ' + err.message); // an error occurred
        }
        console.log('Create Cloudformation stack:' +stackName);
        cloudFormation.createStack(params, function(err, data) {
            if (err) {
                console.log('ERROR: ' + err.message); // an error occurred
                return;
            }
            console.log(data);           // successful response
        });
    });
});