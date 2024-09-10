const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { Donations } = require('../../utils/database.js');
// const config = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('donation-list')
		.setDescription('List all donations for a user')
		.addUserOption(option =>
			option.setName('donator')
				.setDescription('User who is donating.')
				.setRequired(true)),
	category: 'donation',
	async execute(interaction) {
		const donationUser = interaction.options.getMember('donator', true);

		let donations;

		try {

			donations = await Donations.findAll({
				where: {
					username: donationUser.id,
				},
			});

			const donationEmbed = new EmbedBuilder()
				.setColor('#42fc5b')
				.setTitle('Total Donation Amounts')
				.setDescription(`Donated by: <@!${donationUser.id}>`);

			donations.forEach(element => {
				donationEmbed.addFields({ name: element.amount.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 }), value: element.reason, inline: false });
			});

			interaction.reply({ embeds: [donationEmbed] });
		}
		catch (e) {
			console.log(e);
		}
	},
};