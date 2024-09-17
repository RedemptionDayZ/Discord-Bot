const { SlashCommandBuilder } = require('discord.js');
const { currencyApiKey } = require('../../credentials.json');

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
		const conversionCurrency = interaction.options.getString('currency', true);

		const apiUrl = `https://api.currencybeacon.com/v1/convert?api_key=${currencyApiKey}&from=${conversionCurrency}&to=GBP&amount=${conversionAmount}`;

		fetch(apiUrl)
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response to Currency Convert was not ok');
				}
				return response.json();
			})
			.then(data => {
				interaction.reply(`${conversionAmount}${conversionCurrency} = ${data.response.value.toFixed(2)}GBP`);
			})
			.catch(error => {
				console.error('Currency API:', error);
				interaction.reply({ content: 'There was an error contacting the conversion API, check the API key is correct.', ephemeral: true });
			});
	},
};