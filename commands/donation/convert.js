const { SlashCommandBuilder } = require('discord.js');
const { currencyApiKey } = require('../../credentials.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('currency-convert')
		.setDescription('Convert between currencies.')
		.addNumberOption(option =>
			option.setName('amount')
				.setDescription('The original amount you wish to convert.')
				.setRequired(true)
				.setMinValue(0.01))
		.addStringOption(option =>
			option.setName('currency-from')
				.setDescription('Currency code you are converting from.')
				.setRequired(true)
				.addChoices(
					{ name: 'USD - United States Dollar', value: 'USD' },
					{ name: 'EUR - Euros', value: 'EUR' },
					{ name: 'GBP - Great British Pound', value: 'GBP' },
				))
		.addStringOption(option =>
			option.setName('currency-to')
				.setDescription('Currency code you are converting from.')
				.setRequired(false)
				.addChoices(
					{ name: 'USD - United States Dollar', value: 'USD' },
					{ name: 'EUR - Euros', value: 'EUR' },
					{ name: 'GBP - Great British Pound', value: 'GBP' },
				)),
	category: 'donation',
	async execute(interaction) {
		const conversionAmount = interaction.options.getNumber('amount', true);
		const conversionCurrencyFrom = interaction.options.getString('currency-from', true);
		const conversionCurrencyTo = interaction.options.getString('currency-to') ?? 'GBP';

		const apiUrl = `https://api.currencybeacon.com/v1/convert?api_key=${currencyApiKey}&from=${conversionCurrencyFrom}&to=${conversionCurrencyTo}&amount=${conversionAmount}`;

		fetch(apiUrl)
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response to Currency Convert was not ok');
				}
				return response.json();
			})
			.then(data => {
				interaction.reply(`${conversionAmount}${conversionCurrencyFrom} = ${data.response.value.toFixed(2)}${conversionCurrencyTo}`);
			})
			.catch(error => {
				console.error('Currency API:', error);
				interaction.reply({ content: 'There was an error contacting the conversion API, check the API key is correct.', ephemeral: true });
			});
	},
};