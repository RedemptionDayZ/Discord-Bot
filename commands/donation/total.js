const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { Donations } = require('../../utils/database.js');
// const config = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('donation-total')
		.setDescription('Total of all donations for a user')
		.addUserOption(option =>
			option.setName('donator')
				.setDescription('User who is donating.')
				.setRequired(true)),
	category: 'donation',
	async execute(interaction) {
		const donationUser = interaction.options.getMember('donator', true);

		let donations;
		let total = 0;

		try {

			donations = await Donations.findAll({
				where: {
					username: donationUser.id,
				},
			});

			donations.forEach(element => {
				total += element.amount;
			});

			const donationEmbed = new EmbedBuilder()
				.setColor('#42fc5b')
				.setTitle('Total Donation Amount')
				.setDescription(`${total.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 })}`)
				.addFields({ name: 'Donator', value: `<@!${donationUser.id}>`, inline: true });

			interaction.reply({ embeds: [donationEmbed] });
		}
		catch (e) {
			console.log(e);
		}
	},
};