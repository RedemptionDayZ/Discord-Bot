const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('currency-convert')
		.setDescription('Converts currencies to GBP.')
		.addNumberOption(option =>
			option.setName('amount')
				.setDescription('The original amount you wish to convert.')
				.setRequired(true)
				.setMinValue(0.01))
		.addStringOption(option =>
			option.setName('currency')
				.setDescription('Currency code you are converting from.')
				.setRequired(true)
				.addChoices(
					{ name: 'USD - United States Dollar', value: 'USD' },
					{ name: 'EUR - Euros', value: 'EUR' },
				)),
	category: 'donation',
	async execute(interaction) {
		const conversionAmount = interaction.options.getNumber('amount', true);
		const conversionCurrency = interaction.options.getString('group', true);
	},
};