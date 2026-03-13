
echo "Starting All Servers"

if [ $1 == '-p' ]
then
  nx serve --project powerxtra-api --no-tui
fi
