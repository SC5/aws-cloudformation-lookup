# aws-cloudformation-lookup NPM module

A module for loading the resources from an AWS cloudformation stack.

The module has a function

loadStack(stackName, function(err, stackResources))

which returns all resources from the stack with the following properties:

* LogicalResourceId : logical resource name used in cloudformation
* PhysicalResourceId : actual resource name as installed
* Arn : Arn to resource
* ResourceType: type of resource

## Usage

```javascript
  var cloudLookup = require('aws-cloudformation-lookup');

  cloudlookup.loadStack('MyStack', function(err, stackResources) {
    var arn = stackResources['myEC2Instance'].Arn;
    ... 
  });
```

## Release History

* 2015/12/07 - v0.1.3 - Fixes to Arns
* 2015/12/06 - v0.1.0 - Initial version of module

## License

Copyright (c) 2015 [SC5](http://sc5.io/), licensed for users and contributors under MIT license.
https://github.com/SC5/aws-cloudformation-lookup/blob/master/LICENSE


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/SC5/aws-cloudformation-lookup/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
