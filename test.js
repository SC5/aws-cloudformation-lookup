var pkg = require('./package.json');
var expect = require('expect');
var cloudFormationLookup= require('./index.js');

describe('aws-cloudformation-lookup', function() {
    describe('loadStack()', function() {
        var stackResources;
        before(function(done) {
            cloudFormationLookup.loadStack(pkg.config.testStackName, function(err, data) {
                if(err) {
                    return done(err);
                }
                stackResources = data;
                done();
            });
        });

        it('Resources keyd by logical name', function(done) {
            expect(typeof(stackResources.WebServerInstance)).toEqual('object');
            done();     
        });

        it('Resources have an Arn', function(done) {
            for (var res in stackResources) {
                expect(stackResources[res].Arn).toMatch(/arn:aws:.+/);
            }
            done();     
        });

        it('Returns an error for non-existing stack', function(done) {
            cloudFormationLookup.loadStack('NONEXISTINGSTACK'+ Math.floor(Math.random() * 100000), function(err, data) {
                expect(err).toMatch(/does not exist/);
                done();
            });
        })
    });
});