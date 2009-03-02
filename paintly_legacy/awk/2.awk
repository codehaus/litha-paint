BEGIN{
a = "";
}
{
a = a $0
a = a ","
}
END{
print a
}