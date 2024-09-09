const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Remove silent role from member')
		.addUserOption(option =>
			option
				.setName('member')
				.setDescription('The member you wish to unmute.')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('announce')
				.setDescription('Whether you wish to announce in channel user was unmuted. Default: false.')),
	category: 'moderation',
	permissionLevel: 1,
	async execute(interaction) {
		const mutedMember = interaction.options.getMember('member', true);
		const announceUnmute = interaction.options.getBoolean('announce');

		if (!mutedMember.roles.cache.has(config.muteRoleID)) {
			interaction.reply({ content: `<@!${mutedMember.id}> is not muted, use \`\\mute <member>\` to mute them.`, ephemeral: true });
			return;
		}

		mutedMember.roles.remove(config.muteRoleID);

		if (announceUnmute) {
			interaction.reply(`<@!${mutedMember.id}> has been unmuted.`);
		}
		else {
			interaction.reply({ content: `<@!${mutedMember.id}> has been unmuted.`, ephemeral: true });
		}
		return;
	},
};