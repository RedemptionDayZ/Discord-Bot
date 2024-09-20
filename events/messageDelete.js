const { Events } = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: Events.MessageDelete,
	async execute(message) {
		if (message.channelId == config.suggestionChannel) {

		}
	},
};