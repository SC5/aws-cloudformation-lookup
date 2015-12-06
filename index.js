var Promise = require('bluebird');
var AWS = require('aws-sdk');
if (typeof AWS.config.region !== 'string') {
    console.error('No region found, defaulting to eu-west-1');
    AWS.config.update({ region: 'eu-west-1' }); 
}

var region = AWS.config.region;
var cloudFormation = new AWS.CloudFormation();
var IAM = new AWS.IAM();

var accountId = {};
var stackResources = {};
var currStack = null;

var resourceTypeMap = {
    'AWS::EC2::SecurityGroup': {
        service: 'iam',
        resourceType: 'security-group',
    }

}

function buildArn(resource, accountId) {
    var physicalResource = resource.PhysicalResourceId;
    var parts = resource.ResourceType.split('::');
    var service = parts[1].toLowerCase();
    var resourceType = parts[2].toLowerCase();
    var region = AWS.config.region;
    if (resourceTypeMap[resource.ResourceType]) {
        service = resourceTypeMap[resource.ResourceType].service;
        resourceType = resourceTypeMap[resource.ResourceType].resourceType;
    }

    switch (service) {
        case 'iam': return ['arn:aws:iam', accountId, resourceType, physicalResource].join(':')
        default: return ['arn:aws', service, region, accountId, resourceType, physicalResource].join(':');
    }

    return physicalResource;
}

function getResourceMap(stack, accountId) {
    return new Promise(function(success, fail) {        
        cloudFormation.listStackResources({
            StackName: stack
        }, function(err, data) {
            if (err) {
                return fail(err);
            }
            var resources = {};
            data.StackResourceSummaries.forEach(function(resource, idx) {
                var arn = buildArn(resource, accountId);
                if (arn.length > 0) {
                    resources[resource.LogicalResourceId] = arn;
                }
            });
            success(resources);
        });
    });
}

function getAccountId() {
    return new Promise(function(success, fail) {
        IAM.getUser({}, function(err, data) {
            if (err) {
                return fail(err);
            }
            var accountId = data.User.Arn.replace(/arn:[^0-9]+::/, '').replace(/:.+/, '');
            success(accountId);
        });
    });
}

function loadStack(stackName, callback) {
    stack = stackName;
    getAccountId().then(function(accountId) {     
        cloudFormation.listStackResources({
            StackName: stack
        }, function(err, data) {
            if (err) {
                return callback(err);
            }
            var resources = {};
            data.StackResourceSummaries.forEach(function(resource, idx) {
                console.log(resource);
                var arn = buildArn(resource, accountId);
                
                if (arn.length > 0) {
                    resource.Arn = arn;
                }
                resources[resource.LogicalResourceId] = resource;
            });
            stackResources = resources;

            callback(null,resources);
        });
    }, function(error) {
        callback(error);
    });
}

module.exports = exports = {
    loadStack: loadStack
}