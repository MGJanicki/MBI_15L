function getToken(word, tokenLength, position)
{
	return word.substring(position, position + tokenLength);
}

function tokenize(word, tokenLength)
{
	
}

exports.getToken = function(word, tokenLength, position)
{
	return getToken(word, tokenLength, position);
}

exports.tokenize = function(word, tokenLength)
{
	return tokenize(word, tokenLength);
}