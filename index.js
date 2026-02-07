const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const { Client, GatewayIntentBits, ChannelType, EmbedBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');
const net = require('net');

// Read configuration from config.yml file
const configPath = path.join(__dirname, 'config.yml');
const configFile = fs.readFileSync(configPath, 'utf8');
const config = YAML.parse(configFile);

// Define slash commands
const commands = [
  new SlashCommandBuilder()
    .setName('testeembed')
    .setDescription('Test the server status embeds')
    .addStringOption(option =>
      option
        .setName('status')
        .setDescription('Choose the status to test')
        .setRequired(true)
        .addChoices(
          { name: 'Online', value: 'online' },
          { name: 'Offline', value: 'offline' }
        )
    )
    .toJSON(),
];

// Create Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
});

// Variable to store previous server status
let previousServerStatus = null;

/**
 * Checks the status of the Minecraft server by verifying if the port is open
 * @returns {Promise<boolean>} true if online, false if offline
 */
async function checkMinecraftServer() {
  return new Promise((resolve) => {
    const socket = net.createConnection(
      config.minecraft.port,
      config.minecraft.host
    );

    const timeout = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, 5000); // 5 second timeout

    socket.on('connect', () => {
      clearTimeout(timeout);
      socket.destroy();
      resolve(true);
    });

    socket.on('error', () => {
      clearTimeout(timeout);
      resolve(false);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

/**
 * Sends a professional embed to the Discord channel
 * @param {boolean} isOnline - true if server is online, false if offline
 * @param {string} onlineRoleId - Role ID to mention when online
 * @param {string} offlineRoleId - Role ID to mention when offline
 */
async function sendMessageToChannel(isOnline, onlineRoleId = null, offlineRoleId = null) {
  try {
    const channel = await client.channels.fetch(config.discord.channelId);

    if (!channel || channel.type !== ChannelType.GuildText) {
      console.error('Channel not found or is not a text channel');
      return;
    }

    const roleId = isOnline ? onlineRoleId : offlineRoleId;

    // Create professional embed
    const embed = new EmbedBuilder()
      .setTitle(isOnline ? '✅ SERVER STATUS: ONLINE' : '⛔ SERVER STATUS: OFFLINE')
      .setDescription(
        isOnline
          ? '> The Minecraft server is now **online** and ready for players to connect.\n> All systems are operational.'
          : '> The Minecraft server is currently **offline**.\n> Operations are suspended.'
      )
      .setColor(isOnline ? 0x2ECC71 : 0xE74C3C) // Professional green/red
      .addFields(
        { 
          name: '🖥️ Server Address', 
          value: `> \`${config.minecraft.host}:${config.minecraft.port}\``, 
          inline: true 
        },
        { 
          name: '📊 Status', 
          value: isOnline ? '> **ACTIVE**' : '> **INACTIVE**', 
          inline: true 
        },
        {
          name: '⏰ Last Updated',
          value: `> <t:${Math.floor(Date.now() / 1000)}:f>`,
          inline: false,
        },
        {
          name: '📍 Region',
          value: `> ${config.minecraft.region}`,
          inline: true,
        },
        {
          name: '🔌 Port',
          value: `> \`${config.minecraft.port}\``,
          inline: true,
        }
      );

    embed
      .setFooter({
        text: 'Minecraft Server Monitor | Automated Status Updates',
        iconURL: 'https://www.minecraft.net/etc/designs/minecraft/base/images/minecraft-icon-112.png',
      })
      .setTimestamp();

    // Send with role mention in content for notification
    const messageContent = roleId && roleId !== 'null' && roleId !== null 
      ? `<@&${roleId}>`
      : null;

    await channel.send({
      content: messageContent,
      embeds: [embed],
      allowedMentions: { roles: roleId ? [roleId] : [] }
    });

    const status = isOnline ? '🟢 ONLINE' : '🔴 OFFLINE';
    console.log(`✅ Embed sent: ${status}`);
  } catch (error) {
    console.error('Error sending embed:', error);
  }
}

/**
 * Function that monitors the Minecraft server
 */
async function monitorMinecraftServer() {
  setInterval(async () => {
    try {
      const currentStatus = await checkMinecraftServer();

      // If the status changed
      if (previousServerStatus !== currentStatus) {
        if (currentStatus) {
          // Server turned on
          console.log('🟢 Minecraft Server ONLINE');
          await sendMessageToChannel(true, config.mentions.onlineRole, config.mentions.offlineRole);
        } else {
          // Server turned off
          console.log('🔴 Minecraft Server OFFLINE');
          await sendMessageToChannel(false, config.mentions.onlineRole, config.mentions.offlineRole);
        }

        // Update previous status
        previousServerStatus = currentStatus;
      }
    } catch (error) {
      console.error('Monitoring error:', error);
    }
  }, config.minecraft.checkInterval * 1000);
}

/**
 * Register slash commands
 */
async function registerCommands() {
  try {
    const rest = new REST({ version: '10' }).setToken(config.discord.token);
    
    console.log('📝 Registering slash commands...');
    
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, config.discord.guildId),
      { body: commands }
    );
    
    console.log('✅ Slash commands registered successfully');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

/**
 * Create embed for testing
 */
function createTestEmbed(isOnline) {
  const embed = new EmbedBuilder()
    .setTitle(isOnline ? '✅ SERVER STATUS: ONLINE' : '⛔ SERVER STATUS: OFFLINE')
    .setDescription(
      isOnline
        ? '> The Minecraft server is now **online** and ready for players to connect.\n> All systems are operational.'
        : '> The Minecraft server is currently **offline**.\n> Operations are suspended.'
    )
    .setColor(isOnline ? 0x2ECC71 : 0xE74C3C)
    .addFields(
      { 
        name: '🖥️ Server Address', 
        value: `> \`${config.minecraft.host}:${config.minecraft.port}\``, 
        inline: true 
      },
      { 
        name: '📊 Status', 
        value: isOnline ? '> **ACTIVE**' : '> **INACTIVE**', 
        inline: true 
      },
      {
        name: '⏰ Last Updated',
        value: `> <t:${Math.floor(Date.now() / 1000)}:f>`,
        inline: false,
      },
      {
        name: '📍 Region',
        value: `> ${config.minecraft.region}`,
        inline: true,
      },
      {
        name: '🔌 Port',
        value: `> \`${config.minecraft.port}\``,
        inline: true,
      }
    )
    .setFooter({
      text: 'Minecraft Server Monitor | Automated Status Updates',
      iconURL: 'https://www.minecraft.net/etc/designs/minecraft/base/images/minecraft-icon-112.png',
    })
    .setTimestamp();

  return embed;
}

// Event: Bot connected
client.on('ready', async () => {
  console.log(`✅ Bot connected as ${client.user.tag}`);
  console.log(`🎮 Monitoring server at ${config.minecraft.host}:${config.minecraft.port}`);
  console.log(`📢 Notification channel: ${config.discord.channelId}`);
  console.log(
    `⏱️  Check interval: every ${config.minecraft.checkInterval} seconds`
  );

  // Register slash commands
  await registerCommands();

  // Start monitoring
  monitorMinecraftServer();
});

// Event: Handle slash commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'testeembed') {
    const status = interaction.options.getString('status');
    const isOnline = status === 'online';

    try {
      const embed = createTestEmbed(isOnline);

      await interaction.reply({
        embeds: [embed],
        ephemeral: false,
      });

      console.log(`✅ Test embed sent: ${status.toUpperCase()}`);
    } catch (error) {
      console.error('Error sending test embed:', error);
      await interaction.reply({
        content: '❌ Error sending test embed',
        ephemeral: true,
      });
    }
  }
});

// Event: Error
client.on('error', (error) => {
  console.error('Discord error:', error);
});

// Log in the bot
client.login(config.discord.token);
