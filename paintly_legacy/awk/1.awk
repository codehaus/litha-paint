{
	if ($0 ~ /eventHandler\[[0-9]*\]\[\"[a-zA-Z]*\"\]/) {
		print substr($3,2,length($3)-3)
	}
}