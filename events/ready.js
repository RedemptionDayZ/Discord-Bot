const { Events } = require('discord.js');
const { Suggestions, Donations } = require('../utils/database.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		await Suggestions.sync().then(console.log('Suggestions table connection established.'));
		await Donations.sync().then(console.log('Donations table connection established.'));
		console.log(`Bot logged in as ${client.user.tag}`);
	},
};