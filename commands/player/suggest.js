const { SlashCommandBuilder } = require('discord.js');
const { Suggestions } = require('../../utils/database.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Create a server suggestion')
		.addStringOption(option =>
			option.setName('suggestion')
				.setDescription('The text of the suggestion.')),
	category: 'player',
	async execute(interaction) {
		const lastRecord = await Suggestions.findOne({
			order:[['createdAt', 'DESC']],
		});

		interaction.reply(lastRecord.description);
	},
};