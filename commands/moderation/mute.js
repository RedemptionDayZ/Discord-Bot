const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Give silent role to member')
		.addUserOption(option =>
			option
				.setName('member')
				.setDescription('The member you wish to mute.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Message to be displayed in chat alongside mute. If empty mute is not announced.')),
	category: 'moderation',
	permissionLevel: 1,
	async execute(interaction) {
		const mutedMember = interaction.options.getMember('member', true);
		const muteReason = interaction.options.getString('reason');

		const muteEmbed = new EmbedBuilder()
			.setColor('#fc4242')
			.setTitle(`Member <@!${mutedMember.id}> muted`)
			.addFields({ name: 'Mute Reason', value: muteReason, inline: true });

		if (mutedMember.roles.cache.has(config.muteRoleID)) {
			interaction.reply({ content: `<@!${mutedMember.id}> is already muted, use \`\\Unmute <member>\` to unmute them.`, ephemeral: true });
			return;
		}

		mutedMember.roles.add(config.muteRoleID);

		if (muteReason) {
			interaction.reply({ embeds: [muteEmbed] });
		}
		else {
			interaction.reply({ content: `<@!${mutedMember.id}> has been muted`, ephemeral: true });
		}
		return;
	},
};