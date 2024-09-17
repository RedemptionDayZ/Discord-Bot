@echo off
if NOT exist credentials.json (
echo {> credentials.json
echo 	"token": "Discord bot's token from your Discord developer portal",>> credentials.json
echo 	"clientId": "Discord bot's application ID",>> credentials.json
echo 	"guildId": "Discord Server ID the bot will be running in",>> credentials.json
echo 	"currencyApiKey": "Myd768qA2eQZOcn77BcPn7Uz5noRSOGq">> credentials.json
echo }>> credentials.json
)
if NOT exist config.json copy config_template.json config.json
if NOT exist startBot.bat echo node .>startBot.bat
if NOT exist deployBotCommands.bat echo node deploy-commands.js>deployBotCommands.bat
npm install
