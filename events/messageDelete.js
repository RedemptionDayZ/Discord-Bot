const { Events } = require('discord.js');
const config = require('../config.json');
const { Suggestions } = require('../utils/database.js');

module.exports = {
	name: Events.MessageDelete,
	async execute(message) {
		if (message.channelId == config.suggestionChannel) {
			let suggestions;
			try {
				suggestions = await Suggestions.findOne({
					where: {
						embedMessageId: message.id,
					},
				});
				if (suggestions) {
					await Suggestions.update({ archived: true }, {
						where: {
							embedMessageId: message.id,
						},
					});
				}
			}
			catch (e) {
				console.log(e);
			}
		}
	},
};