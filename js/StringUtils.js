function getToken(word, tokenLength, position)
{
	return word.substring(position, position + tokenLength);
}

function tokenize(word, tokenLength)
{
	var tokens = [];
	for(var i = 0; i + tokenLength <= word.length; i++)
	{
		tokens.push(getToken(word, tokenLength, i));
	}
	return tokens;
}

exports.getToken = function(word, tokenLength, position)
{
	return getToken(word, tokenLength, position);
}

exports.tokenize = function(word, tokenLength)
{
	return tokenize(word, tokenLength);
}