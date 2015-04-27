// load Unit.js module
var test = require('unit.js');
var stringUtils = require('../js/StringUtils.js');

describe('Test suite 1', function(){
	it('Test case 1', function(){
		var token = stringUtils.getToken('asdf', 3, 0);
		test
		.string(token)
		.startsWith('asd')
		
		console.log(token);
	})
});

describe('Learning by the example', function(){
	it('example variable', function(){
	// just for example of tested value
		var example = 'hello world';
		test
		.string(example)
		.startsWith('hello')
		.match(/[a-z]/)
		.given(example = 'you are welcome')
		.string(example)
		.endsWith('welcome')
		.contains('you')
		.when('"example" becomes an object', function(){
		example = {
		message: 'hello world',
		name: 'Nico',
		job: 'developper',
		from: 'France'
		};
	})
		.then('test the "example" object', function(){
		test
		.object(example)
		.hasValue('developper')
		.hasProperty('name')
		.hasProperty('from', 'France')
		.contains({message: 'hello world'})
		;
	})
		.if(example = 'bad value')
		.error(function(){
		example.badMethod();
	})
	;
	});
	
	it('other test case', function(){
	// other tests ...
	});
});