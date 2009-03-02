BEGIN{
 a = ""
}
{
	if (match($0,"onmousedown=\"[a-zA-Z()_]*\"")>0) {
		a = a substr($0,RSTART+13,RLENGTH-16) ","
	}
}
END{
print a
}