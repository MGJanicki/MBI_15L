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
	for(i = 0; i < matrix.length; i++)
	{
		for(j = 0; j < matrix[i].length; j++)
		{
			if(isNaN(parseInt(matrix[i][j])))
			{
				return false;
			}
		}
	}
	return true;
}

function validateInputLength(inputLength)
{
	return !isNaN(parseInt(inputLength)) && parseInt(inputLength) > 0;
}

function validateMinimumScore(score)
{
	return !isNaN(parseInt(score));
}

exports.validateSequence = function(sequence)
{
	return validateSequence(sequence);
}

exports.validateMatrix = function(matrix)
{
	return validateMatrix(matrix);
}

exports.validateInputLength = function(inputLength)
{
	return validateInputLength(inputLength)
}

exports.validateMinimumScore = function(score)
{
	return validateMinimumScore(score);
}