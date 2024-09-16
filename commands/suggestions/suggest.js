const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { Suggestions } = require('../../utils/database.js');
const config = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Create a server suggestion')
		.addStringOption(option =>
			option.setName('suggestion')
				.setDescription('The text of the suggestion.')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('get-updates')
				.setDescription('Opt in to receive DMs when your suggestion gets updated by staff.')),
	category: 'suggestions',
	async execute(interaction) {
		const suggestionChannel = interaction.client.channels.cache.get(config.suggestionChannel);
		const suggestionLogChannel = interaction.client.channels.cache.get(config.logChannel);
		const suggestionDescription = interaction.options.getString('suggestion', true).toLowerCase();
		let suggestionUpdates = interaction.options.getBoolean('get-updates') ?? false;
		let dmUpdateMessage = '';

		if (suggestionUpdates) {
			const dmNotificationEmbed = new EmbedBuilder()
				.setColor(config.status[0][1])
				.setTitle('Thank you for creating a suggestion')
				.setDescription('_You opted in to updates on Redemption for this particular suggestion._');
			await interaction.user.send({ embeds: [dmNotificationEmbed] })
				.catch(error => {
					if (error.code !== 50007) console.log(error);
					suggestionUpdates = false;
					dmUpdateMessage = '\n\n**You opted in to receive updates but you do not have DMs enabled so you will not receive them.**';
				});
		}
		else {
			dmUpdateMessage = '\n\nYou did not opt in for updates on this suggestion.';
		}

		try {
			const lastRecord = await Suggestions.findOne({
				order: [['createdAt', 'DESC']],
			});

			let suggestionID = parseInt(lastRecord.id, 10);
			suggestionID++;
			suggestionID = (`000${suggestionID}`).slice(-4);

			const suggestionEmbed = new EmbedBuilder()
				.setColor('#1f1f1f')
				.setTitle(`Suggestion #${suggestionID}`)
				.setDescription(`${suggestionDescription}`)
				.addFields({ name: 'State', value: 'New', inline: true });

			try {
				suggestionChannel.send({ embeds: [suggestionEmbed] }).then(async (sent) => {
					const embedId = sent.id;
					await Suggestions.create({
						id: suggestionID,
						description: suggestionDescription,
						username: interaction.user.id,
						status: 0,
						embedMessageId: embedId,
						getUpdates: suggestionUpdates,
					});

					sent.startThread({
						name: `Suggestion #${suggestionID} - Discussion`,
						autoArchiveDuration: 1440,
					});

					sent.react(interaction.guild.emojis.cache.get('888238461541302373'))
						.then(() => sent.react(interaction.guild.emojis.cache.get('888238495280287774')));
				});
				interaction.reply({ content: `Suggestion #${suggestionID} created! Thank you for your input.\nStaff will review your suggestion once players have voted.${dmUpdateMessage}`, ephemeral: true });

				suggestionLogChannel.send(`**${interaction.user.username}** has created suggestion **#${suggestionID}**`);
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