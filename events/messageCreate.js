const { Events } = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (message.author.bot) return;
		if (message.channelId == config.suggestionChannel) {
			const messageText = 'If you want to create a suggestion use the command `/suggest` and then use provided threads for discussion.';

			message.member.send(messageText)
				.catch(async error => {
					if (error.code === 50007) {
						console.log(error);
						const messageReply = await message.channel.send(messageText);
						setTimeout(() => messageReply.delete(), 10000);
					}
					else { console.log(error); }
				})
				.then(message.delete());
		}
	},
};