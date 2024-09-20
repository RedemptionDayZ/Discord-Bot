const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config.json');
const { Suggestions } = require('../../utils/database.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('archive')
		.setDescription('Safely delete a suggestion.')
		.addIntegerOption(option =>
			option
				.setName('id')
				.setDescription('The ID of the suggestion.')
				.setMaxValue(9999)
				.setMinValue(1)
				.setRequired(true)),
	category: 'suggestions',
	permissionLevel: 1,
	async execute(interaction) {
		const suggestionChannel = interaction.client.channels.cache.get(config.suggestionChannel);
		const suggestionLogChannel = interaction.client.channels.cache.get(config.logChannel);
		const suggestionID = (`000${interaction.options.getInteger('id', true)}`).slice(-4);

		let suggestions;

		try {
			if (suggestionID.length < 4 || suggestionID.length > 4) {
				interaction.reply({ content: 'The ID must be 4 characters', ephemeral: true });
				return;
			}

			suggestions = await Suggestions.findOne({
				where: {
					id: suggestionID,
				},
			});

			if (suggestions === null) {
				interaction.reply({ content: `There is no suggestion with ID: ${suggestionID}`, ephemeral: true });
				return;
			}
		}
		catch (e) {
			console.log(e);
			interaction.reply({ content: 'Something went wrong finding that suggestion ID.', ephemeral: true });
			return;
		}

		suggestionChannel.messages.fetch(suggestions.embedMessageId)
			.then((msg) => {
				msg.delete();
			})
			.catch(async (error) => {
				interaction.reply({ content: `Error finding message with ID: ${suggestions.embedMessageId}`, ephemeral: true });
				throw error;
			})
			.then(async () => {
				await Suggestions.update({ archived: true }, {
					where: {
						id: suggestionID,
					},
				});
				interaction.reply({ content: `Suggestion #${suggestionID} archived.`, ephemeral: true });
				suggestionLogChannel.send(`**${interaction.user.username}** archived suggestion **#${suggestionID}**`);
			})
			.catch((error) => {
				console.error(error);
			});
	},
};