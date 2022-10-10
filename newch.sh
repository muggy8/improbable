fileName="$(cat /dev/urandom | tr -dc '[:alpha:]' | fold -w ${1:-8} | head -n 1)"
touch "./from-me-to-me/$fileName.md"
echo "created from-me-to-me/$fileName.md"
