## NPM Packages

- discordjs
- sequelize
- sqlite3
- eslint (development)

## Installation

1. Install NodeJS
   1. Check if already installed: open command prompt `node -v` if returns a value you already have it installed and can continue
   2. If not, install from here: https://nodejs.org/en/download/prebuilt-installer recommend using most recent LTS build
2. Within bot's file path, run command `npm install` this will use the dependencies listed in `package.json` to install the correct libraries etc.
3. Run the file `setupFiles.bat` which will create the following:
   1. `credentials.json` you have to populate this with bot's details
   2. `config.json` you will need to add channel, role and emoji IDs in here
   3. `startBot.bat` the file to initiate the bot
   4. `deployBotCommands.bat` this registers the commands to the server
4. If both .json files are done properly you can now run `deployBotCommands.bat`
   1. This registers the applications commands for the server, only has to be run once
5. Copy database.sqlite from previous instance
6. Run `startBot.bat`