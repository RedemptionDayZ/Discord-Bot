const { Events } = require('discord.js');
const { Suggestions } = require('../utils/database.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		await Suggestions.sync().then(console.log('Suggestions table connection established.'));
		console.log(`Bot logged in as ${client.user.tag}`);
	},
};