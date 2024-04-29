const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Give silent role to member')
		.addUserOption(option =>
			option
				.setName('member')
				.setDescription('The member you wish to mute.')
				.setRequired(true)),
	category: 'moderation',
	permissionLevel: 1,
	async execute(interaction) {
		const mutedMember = interaction.options.getUser('member', true);

		
		interaction.reply({ content: 'The ID must be 4 characters', ephemeral: true });
	},
};