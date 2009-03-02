BEGIN{
 a = ""
}
{
	if (match($0,"\"[a-zA-Z\(\)_\"\\!\-., <>'=:#/]*\"")>0) {
		print substr($0,RSTART,RLENGTH)
		#print $0
	}
}
END{

}