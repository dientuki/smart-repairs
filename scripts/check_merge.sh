echo "Testing the merge erros on all files"

if fgrep "<<<<<<<" -r --exclude-dir=vendor --exclude-dir=node_modules --exclude-dir=scripts; then exit 1
fi

if fgrep ">>>>>>>" -r --exclude-dir=vendor --exclude-dir=node_modules --exclude-dir=scripts; then exit 1
fi