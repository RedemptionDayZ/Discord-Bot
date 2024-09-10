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
	category: 'player',
	async execute(interaction) {
		const suggestionChannel = interaction.client.channels.cache.get(config.suggestionChannel);
		const suggestionLogChannel = interaction.client.channels.cache.get(config.logChannel);
		const suggestionDescription = interaction.options.getString('suggestion', true).toLowerCase();
		const suggestionUpdates = interaction.options.getBoolean('get-updates') ?? false;

		try {
			const lastRecord = await Suggestions.findOne({
				order: [['createdAt', 'DESC']],
			});

			let integerValue = parseInt(lastRecord.id, 10);
			integerValue += 1;
			integerValue.toString();
			integerValue = (`000${integerValue}`).slice(-4);

			const suggestionEmbed = new EmbedBuilder()
				.setColor('#1f1f1f')
				.setTitle(`Suggestion #${integerValue}`)
				.setDescription(`${suggestionDescription}`)
				.addFields({ name: 'State', value: 'New', inline: true });

			try {
				suggestionChannel.send({ embeds: [suggestionEmbed] }).then(async (sent) => {
					const embedId = sent.id;
					await Suggestions.create({
						id: integerValue,
						description: suggestionDescription,
						username: interaction.user.id,
						status: 0,
						embedMessageId: embedId,
						getUpdates: suggestionUpdates,
					});

					sent.startThread({
						name: `Suggestion #${integerValue} - Discussion`,
						autoArchiveDuration: 1440,
					});

					sent.react(interaction.guild.emojis.cache.get('888238461541302373'))
						.then(() => sent.react(interaction.guild.emojis.cache.get('888238495280287774')));

					interaction.reply({ content: `Suggestion #${integerValue} created! Thank you for your input.\nStaff will review your suggestion once players have voted.`, ephemeral: true });

					suggestionLogChannel.send(`**${interaction.user.username}** has created suggestion **#${integerValue}**`);
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