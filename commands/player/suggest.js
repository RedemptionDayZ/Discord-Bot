const { SlashCommandBuilder } = require('discord.js');
const { Suggestions } = require('../../utils/database.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Create a server suggestion')
		.addStringOption(option =>
			option.setName('suggestion')
				.setDescription('The text of the suggestion.')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('get-updates')
				.setDescription('Opt in to receive DMs when your suggestion gets updated by staff.')),
	category: 'player',
	async execute(interaction) {
		const suggestionChannel = interaction.client.channels.cache.get('1139011639606267955');
		const suggestionUpdates = interaction.options.getBoolean('get-updates', true);

		const lastRecord = await Suggestions.findOne({
			order:[['createdAt', 'DESC']],
		});

		interaction.reply(lastRecord.description);
	},
};