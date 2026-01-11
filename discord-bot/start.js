require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionsBitField,
  ChannelType,
  REST,
  Routes,
  SlashCommandBuilder,
  MessageFlags,
  OverwriteType
} = require('discord.js');

const CONFIG_PATH = path.join(__dirname, 'config.json');
let config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

const schedulerState = {
  transactions: { enabled: true, timeout: null, nextAt: null, remainingMs: null },
  ratings: { enabled: true, timeout: null, nextAt: null, remainingMs: null }
};

let lastTransactionId = null;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatFooterTime(date) {
  try {
    const pad2 = (n) => String(n).padStart(2, '0');
    const mm = pad2(date.getMonth() + 1);
    const dd = pad2(date.getDate());
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  } catch {
    return date.toISOString();
  }
}

function scheduleTask(kind) {
  const isTxn = kind === 'transactions';
  const min = (isTxn ? config.scheduler.minMinutes : config.scheduler.ratingMinMinutes) * 60 * 1000;
  const max = (isTxn ? config.scheduler.maxMinutes : config.scheduler.ratingMaxMinutes) * 60 * 1000;
  const delay = randInt(min, max);
  const state = schedulerState[kind];
  state.nextAt = Date.now() + delay;
  state.timeout = setTimeout(async () => {
    if (isTxn) await postRandomTransaction(); else await postRandomRating();
    scheduleTask(kind);
  }, delay);
}

function startSchedulersOnReady() {
  schedulerState.transactions.enabled = Boolean(config.scheduler.enabledTransactions);
  schedulerState.ratings.enabled = Boolean(config.scheduler.enabledRatings);
  if (schedulerState.transactions.enabled) scheduleTask('transactions');
  if (schedulerState.ratings.enabled) scheduleTask('ratings');
}

const NON_CRYPTO_METHODS = Object.keys(config.fees).filter((m) => m !== 'Crypto');
const CRYPTO_LIST = Object.keys(config.cryptoEmojiIDs);

function randomAmount() {
  const r = Math.random();
  if (r < 0.6) return randInt(10, 250);
  if (r < 0.9) return randInt(250, 600);
  return randInt(600, 2000);
}

function renderCrypto(name) {
  const emoji = config.cryptoEmojiIDs[name] || '';
  return `${emoji ? `${emoji} ` : ''}\`${name}\``;
}

function renderMethod(name) {
  const emoji = config.emojiIDs[name] || '';
  return `${emoji ? `${emoji} ` : ''}\`${name}\``;
}

function randomStars() {
  const stars = [5, 4, 5, 5, 4, 5, 3];
  const n = pickRandom(stars);
  return '`' + '⭐'.repeat(n) + '`';
}

function randomExchangerMention() {
  const list = Array.isArray(config.exchangers) ? config.exchangers : [];
  if (!list.length) return '<:user:1458994594418135090> `Anonymous`';
  return `<:user:1458994594418135090> <@${pickRandom(list)}>`;
}

async function postRandomTransaction() {
  if (!config.transactionChannelId) return;
  const channel = client.channels.cache.get(config.transactionChannelId);
  if (!channel || !channel.isTextBased()) return;

  const crypto = pickRandom(CRYPTO_LIST);
  const method = pickRandom(NON_CRYPTO_METHODS);
  const amount = randomAmount();
  const feePct = config.fees[method] ?? 0;
  const feeUsd = Math.round((amount * feePct)) / 100;
  const txId = `${config.transactionIdPrefix || 'PRISM'}-${randInt(1000000000, 9999999999)}`;
  lastTransactionId = txId;
  const now = new Date();
  const footerText = formatFooterTime(now);

  const embed = new EmbedBuilder()
    .setTitle('__**Transaction Complete**__')
    .setTimestamp(now)
    .setColor(config.embedColor)
    .setFooter({ text: footerText })
    .setImage('https://cdn.discordapp.com/attachments/1435824300174344192/1456812366384857370/7.png?ex=6959b9be&is=6958683e&hm=bc76e06d42078faa5b18adcc3fab6c366d8285bea49efbad5dfaeda3e1d5772a&')
    .addFields(
      { name: 'Crypto Exchanged', value: renderCrypto(crypto), inline: true },
      { name: 'Amount', value: `\`${amount} USD\``, inline: true },
      { name: `Fees (${feePct}%)`, value: `\`${feeUsd} USD\``, inline: true },
      { name: 'Payment Method', value: renderMethod(method), inline: true },
      { name: 'Rating', value: randomStars(), inline: true },
      { name: 'Transaction ID', value: `\`${txId}\``, inline: true },
      { name: 'Exchange By', value: randomExchangerMention(), inline: true }
    );

  await channel.send({ embeds: [embed] }).catch(() => {});
  console.log(`Posted transaction: ${txId}`);
}

async function postRandomRating() {
  if (!config.ratingChannelId) return;
  const channel = client.channels.cache.get(config.ratingChannelId);
  if (!channel || !channel.isTextBased()) return;

  const txId = lastTransactionId || `${config.transactionIdPrefix || 'PRISM'}-${randInt(1000000000, 9999999999)}`;
  const text = pickRandom(config.ratingTexts || ['Thanks for your feedback!']);
  const now = new Date();
  const footerText = formatFooterTime(now);
  const embed = new EmbedBuilder()
    .setTitle('__**Exchange Rating**__')
    .setTimestamp(now)
    .setColor(config.embedColor)
    .setFooter({ text: footerText })
    .setImage('https://cdn.discordapp.com/attachments/1435824300174344192/1456812378342691010/12.png?ex=6959b9c1&is=69586841&hm=51bb2a3cc8952703a7d77b84928225137c958bdbf4b313a276b62fedd5dc074a&')
    .addFields(
      { name: 'Rating', value: randomStars(), inline: true },
      { name: 'Transaction ID', value: `\`${txId}\``, inline: true },
      { name: 'Exchange By', value: randomExchangerMention(), inline: true },
      { name: 'Summary', value: text }
    );

  await channel.send({ embeds: [embed] }).catch(() => {});
  console.log(`Posted rating for: ${txId}`);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.User]
});

client.once(Events.ClientReady, async () => {
  console.log(`Discord bot logged in as ${client.user.tag}`);
  console.log(`Transaction ID prefix: ${config.transactionIdPrefix}`);
  console.log(`Transaction channel: ${config.transactionChannelId}`);
  console.log(`Rating channel: ${config.ratingChannelId}`);
  console.log(`Scheduler: transactions every ${config.scheduler.minMinutes}-${config.scheduler.maxMinutes} min`);
  startSchedulersOnReady();
});

if (!process.env.DISCORD_TOKEN) {
  console.error('Missing DISCORD_TOKEN in environment. Bot will not start.');
  console.log('Please add DISCORD_TOKEN to your secrets.');
} else {
  client.login(process.env.DISCORD_TOKEN);
}
