
echo "Starting All Servers"

if [ $1 == '-p' ]
then
  nx serve --project powerxtra-api --no-tui
fi

if [ $1 == '-r' ]
then
  nx serve --project radio --no-tui
fi
