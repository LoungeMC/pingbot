const fs = require('fs');
const child = require('child_process');

function InstallPackages() {
	console.log('You didn\'t install the required node packages first!')
	console.log('Please wait... starting to install all required node packages using child process')
	console.log('If the bot can\'t install the package please install it manually')
	try {
		child.execSync('npm i')
		console.log('Install complete!, please run "node index" command again!')
		process.exit()
	} catch (err) {
		console.log('Error! ', err)
		process.exit()
	}
}


if (fs.existsSync('./node_modules/discord.js')) {
	const check = require('./node_modules/discord.js/package.json')
	if (Number(check.version.split('.')[0]) !== 14) {
		console.log('Invalid Discord.JS Version!, Please use Discord.JS 14.x')
		process.exit()
	}
} else {
	InstallPackages()
}


// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, MessageFlags, messageLink } = require('discord.js');
const { token, channelRoleMap } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('threadCreate', async thread => {
	const roles = channelRoleMap[thread.parentId];
	if (roles) {
		const roleMentions = roles.map(role => `<@&${role}>`).join(' ');
		await thread.send({
			content: roleMentions,
			flags: [MessageFlags.SuppressNotifications]
		});
	}
});

// Log in to Discord with your client's token
client.login(token);
