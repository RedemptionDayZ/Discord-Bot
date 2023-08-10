const { SlashCommandBuilder } = require('discord.js');
const { config } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Changes the status of a suggestion')
		.addStringOption(option =>
			option.setName('id')
				.setDescription('The ID #### of the suggestion.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('new-status')
				.setDescription('The new status for the suggestion.')
				.setRequired(true)
				.addChoices(
					{ name: config.status[0][0], value: '0' },
					{ name: config.status[1][0], value: '1' },
					{ name: config.status[2][0], value: '2' },
					{ name: config.status[3][0], value: '3' },
					{ name: config.status[4][0], value: '4' },
				)),
	category: 'moderation',
	async execute(interaction) {
		const suggestionChannel = interaction.client.channels.cache.get(config.suggestionChannel);
		const suggestionLogChannel = interaction.client.channels.cache.get(config.logChannel);
		const suggestionID = interaction.options.getString('id', true).toLowerCase();
		const suggestionStatus = interaction.options.getBoolean('new-status');
	},
};