function getToken(word, tokenLength, position)
{
	return word.substring(position, position + tokenLength);
}

exports.getToken = function(word, tokenLength, position)
{
	return getToken(word, tokenLength, position);
}