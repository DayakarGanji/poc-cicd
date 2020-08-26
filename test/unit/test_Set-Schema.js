var expect = require('expect.js');
var sinon = require('sinon');

// this is the javascript file that is under test
var jsFile = '../../smart-comm-v2/apiproxy/resources/jsc/Set-Schema.js';
var fs = require('fs');
var vm = require('vm');
var path = require('path')

var code = fs.readFileSync(path.join(__dirname, '../../smart-comm-v2/apiproxy/resources/jsc/smart-openapi-spec-v1.json'));
vm.runInThisContext(code);


global.context = {
	getVariable: function(s) {},
	setVariable: function(s) {}
};

global.httpClient = {
	send: function(s) {}
};

global.Request = function(s) {};

var contextGetVariableMethod, contextSetVariableMethod;
let contextVars = {};

// This method will execute before every it() method in the test
// we are stubbing all Apigee objects and the methods we need here
beforeEach(function () {
	contextGetVariableMethod = sinon.stub(context, 'getVariable');
	contextSetVariableMethod = sinon.stub(context, 'setVariable').callsFake(
		function(a,b){
				contextVars[a]=b;
			}
		);
});

// restore all stubbed methods back to their original implementation
afterEach(function() {
	contextGetVariableMethod.restore();
	contextSetVariableMethod.restore();
});

// this is the Loggly test feature here
describe('feature: Swagger data store', function() {
	it('should store swagger data', function() {
		contextGetVariableMethod.withArgs('private.swaggerJson').returns(JSON.stringify(swagger));
		var errorThrown = false;
		try { requireUncached(jsFile);} catch (e) { errorThrown = true; }
		expect(errorThrown).to.equal(false);
		// Validate Swagger Data is set in private.swaggerJson
		expect(contextVars["private.swaggerJson"]).to.equal(JSON.stringify(swagger));	
	});
});

// node.js caches modules that is imported using 'require'
// this utility function prevents caching between it() functions - don't forget that variables are global in our javascript file
function requireUncached(module){
    delete require.cache[require.resolve(module)];
    return require(module);
}
