const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { Donations } = require('../../utils/database.js');
const config = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('donation-add')
		.setDescription('Add a donation entry')
		.addNumberOption(option =>
			option.setName('amount')
				.setDescription('The donation amount in GBP.')
				.setRequired(true)
				.setMinValue(0.01))
		.addUserOption(option =>
			option.setName('donator')
				.setDescription('User who is donating.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('What the donation was for.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('group')
				.setDescription('Clan or group the player belongs to.')
				.setRequired(false)),
	category: 'donation',
	async execute(interaction) {
		const donationLogChannel = interaction.client.channels.cache.get(config.donationLogChannel);
		const donationAmount = interaction.options.getNumber('amount', true);
		const donationUser = interaction.options.getMember('donator', true);
		const donationReason = interaction.options.getString('reason', true);
		const donationGroup = interaction.options.getString('group') ?? null;

		try {
			const donationEmbed = new EmbedBuilder()
				.setColor('#42fc5b')
				.setTitle('New Donation Added')
				.setDescription(`${donationAmount.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 })} : ${donationReason}`)
				.addFields({ name: 'Donator', value: `<@!${donationUser.id}>`, inline: true });

			try {
				interaction.reply({ embeds: [donationEmbed] }).then(async () => {
					await Donations.create({
						reason: donationReason,
						username: donationUser.id,
						amount: donationAmount,
						groupName: donationGroup,
					});

					donationLogChannel.send(`**${donationUser.user.username}** has donated **£${donationAmount}** for: **${donationReason}**`);
				});
			}
			catch (e) {
				console.log(e);
			}
		}
		catch (e) {
			console.log(e);
		}
	},
};