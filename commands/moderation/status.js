const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const config = require('../../config.json');
const { guildId } = require('../../credentials.json');
const { Suggestions } = require('../../utils/database.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Changes the status of a suggestion.')
		.addIntegerOption(option =>
			option
				.setName('id')
				.setDescription('The ID of the suggestion.')
				.setMaxValue(9999)
				.setMinValue(0)
				.setRequired(true))
		.addIntegerOption(option =>
			option
				.setName('new-status')
				.setDescription('The new status for the suggestion.')
				.setRequired(true)
				.addChoices(
					{ name: config.status[0][0], value: 0 },
					{ name: config.status[1][0], value: 1 },
					{ name: config.status[2][0], value: 2 },
					{ name: config.status[3][0], value: 3 },
					{ name: config.status[4][0], value: 4 },
					{ name: config.status[5][0], value: 5 },
				))
		.addStringOption(option =>
			option
				.setName('comment')
				.setDescription('Combined /comment command (can be used for reject reasons etc.)')
				.setRequired(false))
		.addIntegerOption(option =>
			option
				.setName('duplicate-id')
				.setDescription('The ID of the duplicate suggestion.')
				.setMaxValue(9999)
				.setMinValue(0)
				.setRequired(false)),
	category: 'moderation',
	permissionLevel: 1,
	async execute(interaction) {
		const suggestionChannel = interaction.client.channels.cache.get(config.suggestionChannel);
		const suggestionLogChannel = interaction.client.channels.cache.get(config.logChannel);
		const suggestionID = (`000${interaction.options.getInteger('id', true)}`).slice(-4);
		const suggestionStatus = interaction.options.getInteger('new-status');
		// const commentText = interaction.options.getString('comment');
		// const duplicateID = (`000${interaction.options.getInteger('duplicate-id')}`).slice(-4);

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

			if (suggestions.status == suggestionStatus) {
				interaction.reply({ content: `The suggestion already has status ${config.status[suggestionStatus][0].toLowerCase()}`, ephemeral: true });
				return;
			}
		}
		catch (e) {
			console.log(e);
			interaction.reply({ content: 'Something went wrong finding that suggestion ID.', ephemeral: true });
		}

		suggestionChannel.messages.fetch(suggestions.embedMessageId)
			.then((msg) => {

				msg.embeds[0].fields[0].value = `${config.status[suggestionStatus][0]}`;

				const receivedEmbed = msg.embeds[0];
				const newEmbed = EmbedBuilder.from(receivedEmbed).setColor(config.status[suggestionStatus][1]);
				if (suggestionStatus === 5 && !msg.embeds[0].fields[1]) {
					const duplicateMessageLink = `https://discord.com/channels/${guildId}/${config.suggestionChannel}/${suggestions.embedMessageId}`;
					newEmbed.addFields({ name: 'Staff Comment', value:`Duplicate ${duplicateMessageLink}` });
				}
				msg.edit({ embeds: [newEmbed] });
			})
			.catch(async (error) => {
				interaction.reply({ content: `Error finding message with ID: ${suggestions.embedMessageId}`, ephemeral: true });
				throw error;
			})
			.then(async () => {
				await Suggestions.update({ status: suggestionStatus }, {
					where: {
						id: suggestionID,
					},
				});
				suggestionLogChannel.send(`**${interaction.user.username}** updated suggestion **#${suggestionID}**'s status from ~~${config.status[suggestions.status][0]}~~ to **${config.status[suggestionStatus][0]}**`);
			})
			.catch((error) => {
				console.error(error);
			});

		if (suggestions.getUpdates === true && suggestionStatus != 0) {

			let description;

			switch (suggestionStatus) {
			case 1:
				description = 'Your suggestion has caught the interest of players/staff and is now being internally discussed.';
				break;
			case 2:
				description = 'Your suggestion has been accepted.';
				break;
			case 3:
				description = 'Your suggestion has been implemented and is live on the server. Thank you for helping to improve Redemption!';
				break;
			case 4:
				description = 'Your suggestion has been rejected due to: ';
				break;
			case 5:
				description = 'Your suggestion has been marked as a duplicate of suggestion: ';
				break;
			}

			const suggestionUpdateEmbed = new EmbedBuilder()
				.setColor(config.status[suggestionStatus][1])
				.setTitle(`Update on your suggestion #${suggestionID}`)
				.setDescription(`${description}\n\n_You opted in to updates on Redemption for this particular suggestion._`);

			interaction.client.users.send(suggestions.username, { embeds: [suggestionUpdateEmbed] });
		}
	},
};