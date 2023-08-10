const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Suggestions = sequelize.define('suggestions', {
	id: {
		type: Sequelize.STRING,
		primaryKey: true,
		autoIncrement: false,
	},
	description: Sequelize.TEXT,
	username: Sequelize.STRING,
	comment: Sequelize.STRING,
	status: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	embedMessageId: Sequelize.STRING,
	upvote: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	downvote: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	archived: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	},
});

module.exports = { sequelize, Suggestions };
