// zbiór testów dla funkcji walidujących dane wejściowe
var test = require('unit.js');
var assert = test.assert;
var validator = require('../js/Validator.js');


describe('Validator - check if user input is correct', function(){
	it('Validate searched sequence test', function(){
		//prawidłowe dane wejściowe - sekwencja składa się z symboli alfabetu {A, C, G, T}
		var validationResult = validator.validateSequence('ACGTGTAC');
		
		test.bool(validationResult).isTrue();
		
		//niewłaściwe dane wejściowe - symbole spoza alfabetu
		validationResult = validator.validateSequence('ASDFGH');
		
		test.bool(validationResult).isFalse();
	});
	
	it('Validate scoring matrix test', function(){
		//testowa macierz, 1 na przekątnej, -1 w pozostałych komórkach
		//wartości prawidłowe (numeryczne)
		var testMatrix = [];
		for(i = 0; i < 4; i++)
		{
			testMatrix[i] = [];
			for(j = 0; j < 4; j++)
			{
				if(i === j)
				{
					testMatrix[i][j] = 1;
				}
				else
				{
					testMatrix[i][j] = -1;
				}
			}
		}
		console.log(testMatrix);
		
		var validationResult = validator.validateMatrix(testMatrix);
		
		test.bool(validationResult).isTrue();
		
		//niewłaściwe dane wejściowe - znak 'a' na przekątnej
		for(i = 0; i < 4; i++)
		{
			testMatrix[i][i] = 'a';
		}
		console.log(testMatrix);
		
		validationResult = validator.validateMatrix(testMatrix);
		
		test.bool(validationResult).isFalse();
	});
	
	it('Validate treshold parameter', function(){
		//prawidłowe dane wejściowe - parametr określający próg odrzucenia musi być liczbą całkowitą
		var validationResult = validator.validateMinimumScore(10);
		
		test.bool(validationResult).isTrue();
		
		//niewłaściwe dane wejściowe - podany parametr jest literą
		validationResult = validator.validateMinimumScore('a');
		
		test.bool(validationResult).isFalse();
	});
	
	it('Validate token length', function(){
		//prawidłowe dane wejściowe - parametr określający długość słowa-ziarna musi być dodatni
		var validationResult = validator.validateInputLength(10);
		
		test.bool(validationResult).isTrue();
		
		//niewłaściwe dane wejściowe - parametr nie może być liczbą ujemną
		validationResult = validator.validateInputLength(-3);
		
		test.bool(validationResult).isFalse();
		
		//niewłaściwe dane wejściowe - parametr nie może być literą
		validationResult = validator.validateInputLength('a');
		
		test.bool(validationResult).isFalse();
	});
	
});
