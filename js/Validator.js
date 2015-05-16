function validateSequence(sequence)
{
	//podniesienie tekstu do wilekich liter - można walidować
	sequence = sequence.toUpperCase();
	for(i = 0; i < sequence.length; i++)
	{
		if(sequence[i] !== 'A' && sequence[i] !== 'C' && sequence[i]
			&& sequence[i] !== 'G' && sequence[i] !== 'T')
			{
				return false;
			}
	}
	return true;
}

function validateMatrix(matrix)
{
	
}

function validateInputLength(inputLength)
{
	
}

function validateMinimumScore(score)
{
	
}

exports.validateSequence = function(sequence)
{
	return validateSequence(sequence);
}

exports.validateMatrix = function(matrix)
{
	return validateMatrix(matrix);
}