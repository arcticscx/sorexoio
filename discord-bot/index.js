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
  AttachmentBuilder,
  REST,
  Routes,
  SlashCommandBuilder,
  MessageFlags,
  OverwriteType
} = require('discord.js');
const express = require('express');
const Stripe = require('stripe');
const CONFIG_PATH = path.join(__dirname, 'config.json');
/** @type {import('discord.js').ColorResolvable} */
let config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
// -------------------- Scheduler State --------------------
const schedulerState = {
  transactions: { enabled: true, timeout: null, nextAt: null, remainingMs: null },
  ratings: { enabled: true, timeout: null, nextAt: null, remainingMs: null }
};

// Store the last transaction ID and amount so ratings can use the same values
let lastTransactionId = null;
let lastTransactionAmount = null;

// Deduplication guard - prevent processing the same message multiple times
const processedMessages = new Set();
const MAX_PROCESSED_MESSAGES = 1000;

function hasProcessedMessage(messageId) {
  if (processedMessages.has(messageId)) {
    return true;
  }
  processedMessages.add(messageId);
  // Clean up old entries to prevent memory leak
  if (processedMessages.size > MAX_PROCESSED_MESSAGES) {
    const iterator = processedMessages.values();
    processedMessages.delete(iterator.next().value);
  }
  return false;
}

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
    // chain next
    scheduleTask(kind);
  }, delay);
}

function startSchedulersOnReady() {
  schedulerState.transactions.enabled = Boolean(config.scheduler.enabledTransactions);
  schedulerState.ratings.enabled = Boolean(config.scheduler.enabledRatings);
  if (schedulerState.transactions.enabled) scheduleTask('transactions');
  if (schedulerState.ratings.enabled) scheduleTask('ratings');
}

function pauseScheduler(kind) {
  const state = schedulerState[kind];
  if (!state.timeout) return;
  const remaining = state.nextAt - Date.now();
  state.remainingMs = Math.max(0, remaining);
  clearTimeout(state.timeout); state.timeout = null; state.nextAt = null;
}

function resumeScheduler(kind) {
  const state = schedulerState[kind];
  const delay = state.remainingMs && state.remainingMs > 0 ? state.remainingMs : 1000;
  state.nextAt = Date.now() + delay;
  state.timeout = setTimeout(async () => {
    if (kind === 'transactions') await postRandomTransaction(); else await postRandomRating();
    scheduleTask(kind);
  }, delay);
  state.remainingMs = null;
}

function humanEta(state) {
  if (!state.nextAt && !state.remainingMs) return 'n/a';
  const ms = state.nextAt ? (state.nextAt - Date.now()) : state.remainingMs;
  const m = Math.max(0, Math.round(ms / 60000));
  return `${m} min`;
}

// -------------------- Random Data Generators --------------------
const NON_CRYPTO_METHODS = Object.keys(config.fees).filter((m) => m !== 'Crypto');

// Weighted crypto selection: LTC 20%, SOL 20%, ETH 15%, USDT 10%, BTC 5%, BCH 5%, BNB 5%, Ripple 5%, USDC 10%, TRON 5%
const CRYPTO_WEIGHTS = [
  { name: 'Litecoin', weight: 20 },
  { name: 'Solana', weight: 20 },
  { name: 'Ethereum', weight: 15 },
  { name: 'USDT', weight: 10 },
  { name: 'Bitcoin', weight: 5 },
  { name: 'Bitcoin Cash', weight: 5 },
  { name: 'BNB', weight: 5 },
  { name: 'Ripple', weight: 5 },
  { name: 'USDC', weight: 10 },
  { name: 'TRON', weight: 5 }
];

function pickWeightedCrypto() {
  const total = CRYPTO_WEIGHTS.reduce((sum, c) => sum + c.weight, 0);
  let random = Math.random() * total;
  for (const crypto of CRYPTO_WEIGHTS) {
    random -= crypto.weight;
    if (random <= 0) return crypto.name;
  }
  return CRYPTO_WEIGHTS[0].name;
}

const CRYPTO_LIST = Object.keys(config.cryptoEmojiIDs);

function randomAmount() {
  // 10% chance for completely random amount
  if (Math.random() < 0.1) {
    return randInt(15, 2000);
  }
  
  // 90% chance for realistic round exchange amounts
  const amounts = [
    // Small amounts (60% of the 90%)
    15, 20, 25, 30, 35, 40, 45, 50, 60, 75, 80, 85, 90, 95, 100, 
    105, 110, 115, 120, 125, 130, 140, 150, 160, 175, 180, 190, 200, 
    210, 220, 230, 240, 250,
    // Medium amounts (30% of the 90%)
    275, 300, 320, 350, 375, 400, 425, 450, 475, 500, 550, 600,
    // Large amounts (10% of the 90%)
    650, 700, 750, 800, 850, 900, 950, 1000, 1100, 1200, 1250, 1500, 1750, 2000
  ];
  
  const r = Math.random();
  if (r < 0.6) {
    return amounts[randInt(0, 32)];
  } else if (r < 0.9) {
    return amounts[randInt(33, 44)];
  } else {
    return amounts[randInt(45, amounts.length - 1)];
  }
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
  if (!list.length) return '<:user:1459957261458870354> `Anonymous`';
  return `<:user:1459957261458870354> <@${pickRandom(list)}>`;
}

async function postRandomTransaction(messageId = null) {
  if (!config.transactionChannelId) return;
  const channel = client.channels.cache.get(config.transactionChannelId);
  if (!channel || !channel.isTextBased()) return;

  const crypto = pickWeightedCrypto();
  const method = pickRandom(NON_CRYPTO_METHODS);
  const amount = randomAmount();
  const feePct = config.fees[method] ?? 0;
  const feeUsd = Math.round((amount * feePct) ) / 100; // integer cents? keep simple
  
  // Generate deterministic txId when messageId is provided (for command-triggered transactions)
  // This ensures all bot instances generate the same ID for the same command
  let txId;
  if (messageId) {
    // Use last 10 chars of message ID as the numeric portion for determinism
    const numericPart = parseInt(messageId.slice(-10), 10) || randInt(1000000000, 9999999999);
    txId = `${config.transactionIdPrefix || 'PRISM'}-${numericPart}`;
  } else {
    txId = `${config.transactionIdPrefix || 'PRISM'}-${randInt(1000000000, 9999999999)}`;
  }
  // Store the transaction ID and amount so ratings can use the same values
  lastTransactionId = txId;
  lastTransactionAmount = amount;
  const now = new Date();
  const footerText = formatFooterTime(now);

  // Calculate crypto amount based on approximate prices
  const cryptoPrices = {
    'Bitcoin': 95000,
    'Litecoin': 100,
    'Ethereum': 3400,
    'Solana': 180,
    'USDT': 1,
    'XRP': 2.5,
    'BNB': 600,
    'Bitcoin Cash': 400,
    'USDC': 1,
    'Ripple': 2.5,
    'TRON': 0.25
  };
  const cryptoCodes = { 
    'Bitcoin': 'BTC', 
    'Litecoin': 'LTC', 
    'Ethereum': 'ETH', 
    'Solana': 'SOL', 
    'USDT': 'USDT', 
    'XRP': 'XRP',
    'BNB': 'BNB',
    'Bitcoin Cash': 'BCH',
    'USDC': 'USDC',
    'Ripple': 'XRP',
    'TRON': 'TRX'
  };
  const paymentMethodMap = {
    'PayPal': 'paypal',
    'Card': 'card',
    'CashApp': 'paypal',
    'ApplePay': 'card',
    'Revolut': 'paypal',
    'Google Pay': 'card'
  };
  const cryptoAmount = amount / (cryptoPrices[crypto] || 100);

  // Save transaction to production database only
  const transactionData = {
    referenceId: txId,
    amount: amount,
    currency: 'USD',
    cryptoAmount: cryptoAmount,
    cryptoType: cryptoCodes[crypto] || 'BTC',
    paymentMethod: paymentMethodMap[method] || 'card',
    status: 'completed',
    email: `user${randInt(1, 999)}@exchange.com`,
    walletAddress: config.cryptoAddresses[cryptoCodes[crypto]] || '0x' + randInt(100000, 999999).toString(16),
    isFeatured: Math.random() < 0.1
  };

  // Post transaction to the configured site URL
  // The database has a UNIQUE constraint on referenceId, so duplicates will be rejected with 409
  const siteUrl = process.env.SITE_URL || 'http://localhost:5000';
  let transactionCreated = false;
  try {
    console.log(`[BOT ${process.pid}] Creating transaction ${txId} on ${siteUrl}...`);
    const response = await fetch(`${siteUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transactionData)
    });
    if (response.status === 409) {
      console.log(`[BOT ${process.pid}] Transaction ${txId} already exists (duplicate rejected), skipping Discord embed...`);
      return; // Another instance already created this transaction
    }
    if (!response.ok) {
      const errorBody = await response.text();
      console.log(`[BOT ${process.pid}] Failed to save transaction: ${response.status} - ${errorBody}`);
      return; // Don't post embed if transaction failed
    }
    console.log(`[BOT ${process.pid}] Transaction ${txId} saved successfully`);
    transactionCreated = true;
  } catch (err) {
    console.log(`[BOT ${process.pid}] Error saving transaction: ${err.message}`);
    return; // Don't post embed if we couldn't reach the server
  }

  // Only post Discord embed if this instance successfully created the transaction
  if (!transactionCreated) return;

  const embed = new EmbedBuilder()
    .setTitle('__**Transaction Complete**__')
    .setTimestamp(now)
    .setColor(config.embedColor)
    .setFooter({ text: footerText })
    .setImage('https://media.discordapp.net/attachments/1411264760686841888/1435973339217793085/Please_be_patient..._38.png?ex=697df963&is=697ca7e3&hm=6892efc518d074385d596e589302b904c3b75dc18c5e4bd90355cbfdf2af4979&=&format=webp&quality=lossless&width=2400&height=800')
    .addFields(
      { name: 'Crypto Exchanged', value: renderCrypto(crypto), inline: true },
      { name: 'Amount', value: `\`${amount} USD\``, inline: true },
      { name: `Fees (${feePct}%)`, value: `\`${feeUsd} USD\``, inline: true },
      { name: 'Payment Method', value: renderMethod(method), inline: true },
      { name: 'Rating', value: randomStars(), inline: true },
      { name: 'Transaction ID', value: `\`${txId}\``, inline: true },
      { name: 'Exchange By', value: randomExchangerMention(), inline: true }
    );

  await channel.send({ 
    content: `**New Transaction Detected!** \`${txId}\` exchanged \`${amount} USD\` for \`${crypto}\`.`,
    embeds: [embed] 
  }).catch(() => {});

  // 50% chance to also post a rating for this transaction
  if (Math.random() < 0.5) {
    await postRandomRating();
  }
}

async function postRandomRating() {
  if (!config.ratingChannelId) return;
  const channel = client.channels.cache.get(config.ratingChannelId);
  if (!channel || !channel.isTextBased()) return;

  // Use the last transaction ID and amount from the transactions channel, or generate new ones if none exists
  const txId = lastTransactionId || `${config.transactionIdPrefix || 'PRISM'}-${randInt(1000000000, 9999999999)}`;
  const amount = lastTransactionAmount || randomAmount();
  const text = pickRandom(config.ratingTexts || ['Thanks for your feedback!']);
  const now = new Date();
  const footerText = formatFooterTime(now);
  const embed = new EmbedBuilder()
    .setTitle('__**Exchange Rating**__')
    .setTimestamp(now)
    .setColor(config.embedColor)
    .setFooter({ text: footerText })
    .setImage('https://media.discordapp.net/attachments/1411264760686841888/1435973553030692966/Please_be_patient..._39.png?ex=697df996&is=697ca816&hm=bd1f97aa1f4c9a82aceaa81060003eeaaf317353d1377a9b61b42ee83bcdff84&=&format=webp&quality=lossless&width=2400&height=800')
    .addFields(
      { name: 'Rating', value: randomStars(), inline: true },
      { name: 'Amount', value: `\`${amount} USD\``, inline: true },
      { name: 'Transaction ID', value: `\`${txId}\``, inline: true },
      { name: 'Exchange By', value: randomExchangerMention(), inline: true },
      { name: 'Summary', value: text }
    );

  await channel.send({ embeds: [embed] }).catch(() => {});
}

// moved config init to top

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.User]
});

// In-memory state per user for exchange flow
const userFlowState = new Map();

const SENDING_METHODS = [
  'Crypto',
  'PayPal',
  'CashApp',
  'ApplePay',
  'Card',
  'Revolut',
  'Google Pay'
];

const CRYPTO_OPTIONS = [
  { key: 'Bitcoin', code: 'BTC' },
  { key: 'Litecoin', code: 'LTC' },
  { key: 'Ethereum', code: 'ETH' },
  { key: 'Solana', code: 'SOL' },
  { key: 'USDT', code: 'USDT' },
  { key: 'XRP', code: 'XRP' },
  { key: 'BNB', code: 'BNB' },
  { key: 'Bitcoin Cash', code: 'BCH' },
  { key: 'USDC', code: 'USDC' },
  { key: 'Ripple', code: 'XRP' },
  { key: 'TRON', code: 'TRX' },
];

function reloadConfig() {
  config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
}

function saveConfig(newConfig) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2), 'utf8');
  reloadConfig();
}

function isAdmin(member) {
  if (!member) return false;
  const userId = member.user?.id || member.id;
  const byUserId = Array.isArray(config.adminIds) && config.adminIds.includes(userId);
  const byRole = Array.isArray(config.adminRoles) && config.adminRoles.some((r) => member.roles.cache.has(r));
  return Boolean(byUserId || byRole);
}

function buildRequestEmbed() {
  return new EmbedBuilder()
    .setTitle('Request an Exchange')
    .setDescription(
      'You can request an exchange by selecting the appropriate option below for the payment type you\'ll be sending with. Follow the instructions and fill out the fields as requested.\n\n' +
      '**Reminder**\n <:info:1459942186966843476> Please read our Term Of Service before creating an Exchange.\n\n' +
      '**Minimum Exchange Amount**\n <:tick:1459942171246333982> Our minimum exchange amount is $12.50 USD and is applicable on every deal and is non-negotiable.'
    )
    .setThumbnail(config.brandLogo)
    .setImage('https://cdn.discordapp.com/attachments/1459945692696150027/1459945898548269086/12.png?ex=69652012&is=6963ce92&hm=b11d53e2744309cefa33dcde82c51ab6445ee73f19ec71118fa6dcecbbfbb958&') // ← embed image
    .setFooter({ text: config.brandName, iconURL: config.brandLogo })
    .setColor(config.embedColor);
}

function buildSendingSelect() {
  const menu = new StringSelectMenuBuilder()
    .setCustomId('send_method_select')
    .setPlaceholder('Select the payment method you are sending with')
    .addOptions(
      SENDING_METHODS.map((name) => {
        const fee = config.fees[name] ?? 0;
        const emoji = config.emojiIDs[name] || undefined;
        return new StringSelectMenuOptionBuilder()
          .setLabel(name)
          .setDescription(`${fee}% Fee`)
          .setValue(name)
          .setEmoji(emoji);
      })
    );
  return new ActionRowBuilder().addComponents(menu);
}

function buildCryptoSelect(customId) {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder('Select a cryptocurrency')
    .addOptions(
      CRYPTO_OPTIONS.map((c) => {
        const opt = new StringSelectMenuOptionBuilder()
          .setLabel(`${c.key} (${c.code})`)
          .setValue(c.key);
        const emoji = (config.cryptoEmojiIDs && config.cryptoEmojiIDs[c.key]) || undefined;
        if (emoji) opt.setEmoji(emoji);
        return opt;
      })
    );
  return new ActionRowBuilder().addComponents(menu);
}

function buildReceiveMethodSelect(exclude) {
  const menu = new StringSelectMenuBuilder()
    .setCustomId('receive_method_select')
    .setPlaceholder('Select the payment method you want to receive')
    .addOptions(
      SENDING_METHODS.filter((m) => m !== exclude).map((name) => {
        const fee = config.fees[name] ?? 0;
        const emoji = config.emojiIDs[name] || undefined;
        return new StringSelectMenuOptionBuilder()
          .setLabel(name)
          .setDescription(`${fee}% Fee`)
          .setValue(name)
          .setEmoji(emoji);
      })
    );
  return new ActionRowBuilder().addComponents(menu);
}

function amountModal() {
  const modal = new ModalBuilder()
    .setCustomId('exchange_details_modal')
    .setTitle('Enter Exchange Details');

  const amount = new TextInputBuilder()
    .setCustomId('amount_input')
    .setLabel('Enter the amount you are sending')
    .setPlaceholder('e.g. 100$')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const row = new ActionRowBuilder().addComponents(amount);
  modal.addComponents(row);
  return modal;
}

function parseAmount(str) {
  const cleaned = String(str).replace(/[^0-9.]/g, '');
  const value = Number.parseFloat(cleaned);
  return Number.isFinite(value) ? value : NaN;
}

function calcAfterFees(amount, sendingMethod) {
  const feePct = Number(config.fees[sendingMethod] ?? 0);
  const totalReceive = amount * (1 - feePct / 100);
  return { feePct, totalReceive };
}

function summaryEmbed(user, sending, receiving, amount, feePct, totalReceive) {
  const receivingEmoji = (config.cryptoEmojiIDs && config.cryptoEmojiIDs[receiving]) || '';
  const receivingDisplay = receivingEmoji ? `${receivingEmoji} \`${receiving}\`` : `\`${receiving}\``;

  const embed = new EmbedBuilder()
    .setTitle(`${config.brandName} – Exchange`)
    .setColor(config.embedColor)
    .setFooter({ text: config.brandName, iconURL: config.brandLogo });

  if (config.ticketImageUrl) {
    embed.setImage(config.ticketImageUrl);
  }

  embed.addFields(
    { name: '**User**', value: `<@${user.id}>`, inline: true },
    { name: '**Sending Method**', value: `\`${sending}\``, inline: true },
    { name: '**Receiving Method**', value: receivingDisplay, inline: true },
    { name: '`✅` **Amount Send** ', value: `\`$${amount.toFixed(2)}\``, inline: true },
    { name: '`🚀` **Fee**\n', value: `\`${feePct.toFixed(2)}%\``, inline: true },
    { name: '`💎` **Total to Receive**', value: `\`$${totalReceive.toFixed(2)}\``, inline: true }
  );

  return embed;
}

function getSymbolEmoji(symbol) {
  const bySymbol = {
    BTC: 'Bitcoin',
    LTC: 'Litecoin',
    ETH: 'Ethereum',
    USDT: 'USDT',
    SOL: 'Solana',
    XRP: 'XRP'
  };
  const name = bySymbol[symbol];
  if (!name) return undefined;
  return config.cryptoEmojiIDs && config.cryptoEmojiIDs[name];
}

function buildTicketControlsRow() {
  const closeEmoji = config.buttonEmojis && config.buttonEmojis.close ? config.buttonEmojis.close : undefined;
  const btn = new ButtonBuilder()
    .setCustomId('ticket_close')
    .setLabel('Close')
    .setStyle(ButtonStyle.Secondary);
  if (closeEmoji) btn.setEmoji(closeEmoji);
  return new ActionRowBuilder().addComponents(btn);
}

function buildDeletePromptRow(disabled = false) {
  const delEmoji = config.buttonEmojis && config.buttonEmojis.delete ? config.buttonEmojis.delete : undefined;
  const cancelEmoji = config.buttonEmojis && config.buttonEmojis.cancel ? config.buttonEmojis.cancel : undefined;
  const delBtn = new ButtonBuilder()
    .setCustomId('ticket_delete_confirm')
    .setLabel('Delete Ticket')
    .setStyle(ButtonStyle.Danger)
    .setDisabled(disabled);
  if (delEmoji) delBtn.setEmoji(delEmoji);
  const cancelBtn = new ButtonBuilder()
    .setCustomId('ticket_delete_cancel')
    .setLabel('Cancel')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(disabled);
  if (cancelEmoji) cancelBtn.setEmoji(cancelEmoji);
  return new ActionRowBuilder().addComponents(delBtn, cancelBtn);
}

async function ensureSlashCommands() {
  const clientId = process.env.CLIENT_ID;
  const guildId = process.env.GUILD_ID; // Prefer guild command for instant availability
  if (!clientId || !guildId) return; // skip if not configured

  const commands = [
    new SlashCommandBuilder()
      .setName('brand')
      .setDescription('Update brand name and logo  ')
      .addStringOption((opt) =>
        opt
          .setName('name')
          .setDescription('New brand name')
          .setRequired(true)
      )
      .addAttachmentOption((opt) =>
        opt
          .setName('logo')
          .setDescription('New brand logo image')
          .setRequired(true)
      )
      .addStringOption((opt) =>
        opt
          .setName('color')
          .setDescription('Embed color (hex, e.g., #2b6ef2)')
          .setRequired(false)
      )
      .addStringOption((opt) =>
        opt
          .setName('txprefix')
          .setDescription('Transaction ID prefix (e.g., SPACE)')
          .setRequired(false)
      )
      .toJSON(),
    new SlashCommandBuilder()
      .setName('btc')
      .setDescription('Post BTC address with QR  ')
      .toJSON(),
    new SlashCommandBuilder()
      .setName('ltc')
      .setDescription('Post LTC address with QR  ')
      .toJSON(),
    new SlashCommandBuilder()
      .setName('eth')
      .setDescription('Post ETH address with QR  ')
      .toJSON(),
    new SlashCommandBuilder()
      .setName('usdt')
      .setDescription('Post USDT address with QR  ')
      .toJSON(),
    new SlashCommandBuilder()
      .setName('sol')
      .setDescription('Post SOL address with QR  ')
      .toJSON(),
    new SlashCommandBuilder()
      .setName('xrp')
      .setDescription('Post XRP address with QR  ')
      .toJSON(),
    new SlashCommandBuilder()
      .setName('exchangers')
      .setDescription('Manage exchangers (admin only)')
      .addSubcommand((sc) => sc.setName('add').setDescription('Add an exchanger').addUserOption((o) => o.setName('user').setDescription('User to add').setRequired(true)))
      .addSubcommand((sc) => sc.setName('remove').setDescription('Remove an exchanger').addUserOption((o) => o.setName('user').setDescription('User to remove').setRequired(true)))
      .addSubcommand((sc) => sc.setName('list').setDescription('List exchangers'))
      .toJSON(),
  ];

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
}

client.once(Events.ClientReady, async () => {
  try {
    await ensureSlashCommands();
  } catch (e) {
    // Non-fatal: command registration can be retried on restart
    console.error('Slash command registration failed:', e.message);
  }
  console.log(`Logged in as ${client.user.tag}`);

  // Start webhook server if Stripe configured
  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const app = express();
    // Stripe requires raw body for signature verification
    app.post('/stripe/webhook', express.raw({ type: 'application/json' }), (req, res) => {
      const sig = req.headers['stripe-signature'];
      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const channelId = session.metadata && session.metadata.channelId;
        const amount = session.amount_total ? session.amount_total / 100 : undefined;
        if (channelId) {
          const channel = client.channels.cache.get(channelId);
          if (channel && channel.isTextBased()) {
            const tick = (config.invoiceEmojis && config.invoiceEmojis.tick) || '✅';
            const embed = new EmbedBuilder()
              .setTitle(`${tick} __**Payment Invoice**__ (Completed)`)
              .setURL('https://discohook.app#gallery-tUwVPUzQ')
              .setColor(config.embedColor)
              .setFooter({ text: `Thank you for using ${config.brandName}!`, iconURL: config.brandLogo })
              .setImage('https://cdn.discordapp.com/attachments/1435824300174344192/1456812366833389794/8.png?ex=6959b9be&is=6958683e&hm=adabdcf3a162d04845f297ba7cd7c20bdbfb5a9e3b876e0e318ad056a7251124&')
              .addFields(
                { name: 'Amount', value: amount ? `\`$${amount.toFixed(2)}\`` : '`—`', inline: true },
                { name: 'Payment Link', value: '[``Click here to pay``](https://support.discord.com)', inline: true },
                { name: 'Status', value: `${tick} \`Complete\``, inline: true }
              );
            channel.send({ embeds: [embed] }).catch(() => {});
            // Send post-payment disclaimer message
            const disclaimer = config.invoiceDescription && String(config.invoiceDescription).trim().length > 0
              ? config.invoiceDescription
              : null;
            if (disclaimer) {
              channel.send({ content: disclaimer }).catch(() => {});
            }
          }
        }
      }
      res.json({ received: true });
    });
    const port = Number(process.env.PORT || 3000);
    app.listen(port, () => console.log(`Stripe webhook listening on :${port}`));
  }

  // start schedulers
  startSchedulersOnReady();
});

// !send command for admins
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  
  // Prevent duplicate processing of the same message
  if (hasProcessedMessage(message.id)) return;
  
  const content = message.content.trim();

  // !send (admin)
  if (content.toLowerCase().startsWith('!send')) {
    if (!isAdmin(message.member)) return; // admin-only
    try {
      const embed = buildRequestEmbed();
      const row = buildSendingSelect();
      await message.channel.send({ embeds: [embed], components: [row] });
      try { await message.delete(); } catch {}
    } catch (err) {
      console.error('Failed to send request embed:', err);
    }
    return;
  }

  // !invoice <amount> (admin) - create a Stripe Checkout link with 2% fee
  if (content.toLowerCase().startsWith('!invoice')) {
    if (!isAdmin(message.member)) return; // admin-only
    if (!process.env.STRIPE_SECRET_KEY) {
      return void message.reply('Stripe is not configured.');
    }
    const parts = content.split(/\s+/);
    const raw = parts.slice(1).join(' ').trim();
    const baseAmount = parseAmount(raw);
    if (!Number.isFinite(baseAmount) || baseAmount <= 0) {
      return void message.reply('Usage: `!invoice 100` or `!invoice $100`');
    }
    const feePct = 2; // fixed 2%
    const payable = baseAmount * (1 + feePct / 100);
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const successUrl = process.env.INVOICE_SUCCESS_URL || 'https://example.com/success';
      const cancelUrl = process.env.INVOICE_CANCEL_URL || 'https://example.com/cancel';
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: Math.max(50, Math.round(payable * 100)),
              product_data: {
                name: `Premium`,
              }
            },
            quantity: 1
          }
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          guildId: message.guild.id,
          channelId: message.channel.id,
          userId: message.author.id,
          amountEntered: baseAmount.toFixed(2),
          feePct: feePct.toString(),
          payableAmount: payable.toFixed(2)
        }
      });

      const cart = (config.invoiceEmojis && config.invoiceEmojis.cart) || '🧾';
      const loading = (config.invoiceEmojis && config.invoiceEmojis.loading) || '⌛';
      const invoiceEmbed = new EmbedBuilder()
        .setTitle(`${cart} __**Payment Invoice**__`)
        .setColor(524293)
        .setFooter({ text: 'This link will expire in 24 hours', iconURL: config.brandLogo })
        .setImage('https://cdn.discordapp.com/attachments/1435824300174344192/1456812377780523233/10.png?ex=6959b9c1&is=69586841&hm=e62c7deccc470d843163425a1efe34076f12b724efc0d8db0b4d1320bd182cb5&')
        .addFields(
          { name: 'Amount', value: `\`$${payable.toFixed(2)}\``, inline: true },
          { name: 'Payment Link', value: `[\`\`Click here to pay\`\`](${session.url})`, inline: true },
          { name: 'Status', value: `${loading}  \`Not Complete\``, inline: true }
        );
      const payBtn = new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Pay Now').setURL(session.url);
      await message.channel.send({ embeds: [invoiceEmbed], components: [new ActionRowBuilder().addComponents(payBtn)] });
    } catch (e) {
      console.error('!invoice failed:', e);
      try { await message.reply('Could not create payment invoice at this time.'); } catch {}
    }
    return;
  }

  // !transactions [on|off]
  if (content.toLowerCase().startsWith('!transactions')) {
    if (!isAdmin(message.member)) return;
    const partsT = content.split(/\s+/);
    const arg = partsT[1]?.toLowerCase();
    const sub = partsT[2]?.toLowerCase();
    if (!arg) {
      const st = schedulerState.transactions;
      return void message.reply(`Transactions: ${st.enabled ? 'ON' : 'OFF'} | Next in ${humanEta(st)}`);
    }
    if (arg === 'send') {
      try {
        await postRandomTransaction(message.id);
        return void message.reply(`Sent a test transaction. Next scheduled in ${humanEta(schedulerState.transactions)} (unchanged).`);
      } catch (e) {
        console.error('transactions send failed:', e);
        return void message.reply('Failed to send test transaction.');
      }
    }
    if (arg === 'off') {
      if (schedulerState.transactions.enabled) {
        schedulerState.transactions.enabled = false;
        pauseScheduler('transactions');
      }
      return void message.reply('Transactions scheduler turned OFF.');
    }
    if (arg === 'on') {
      if (!schedulerState.transactions.enabled) {
        schedulerState.transactions.enabled = true;
        resumeScheduler('transactions');
      }
      return void message.reply(`Transactions scheduler ON. Next in ${humanEta(schedulerState.transactions)}`);
    }
    return;
  }

  // !rating [on|off]
  if (content.toLowerCase().startsWith('!rating')) {
    if (!isAdmin(message.member)) return;
    const partsR = content.split(/\s+/);
    const arg = partsR[1]?.toLowerCase();
    if (!arg) {
      const st = schedulerState.ratings;
      return void message.reply(`Ratings: ${st.enabled ? 'ON' : 'OFF'} | Next in ${humanEta(st)}`);
    }
    if (arg === 'send') {
      try {
        await postRandomRating();
        return void message.reply(`Sent a test rating. Next scheduled in ${humanEta(schedulerState.ratings)} (unchanged).`);
      } catch (e) {
        console.error('rating send failed:', e);
        return void message.reply('Failed to send test rating.');
      }
    }
    if (arg === 'off') {
      if (schedulerState.ratings.enabled) {
        schedulerState.ratings.enabled = false;
        pauseScheduler('ratings');
      }
      return void message.reply('Ratings scheduler turned OFF.');
    }
    if (arg === 'on') {
      if (!schedulerState.ratings.enabled) {
        schedulerState.ratings.enabled = true;
        resumeScheduler('ratings');
      }
      return void message.reply(`Ratings scheduler ON. Next in ${humanEta(schedulerState.ratings)}`);
    }
    return;
  }

  // !help
  if (content.toLowerCase().trim() === '!help') {
    if (!isAdmin(message.member)) return;
    return void message.reply('Commands: !send, !invoice <amount>, !transactions [on|off], !rating [on|off]. Slash: /brand, /btc /ltc /eth /usdt /sol /xrp, /exchangers');
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    // Slash: /brand
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === 'brand') {
        if (!isAdmin(interaction.member)) {
          return interaction.reply({ content: 'You do not have permission to use this command.', flags: MessageFlags.Ephemeral });
        }

        const name = interaction.options.getString('name', true);
        const colorOpt = interaction.options.getString('color');
        const txPrefixOpt = interaction.options.getString('txprefix');
        const logo = interaction.options.getAttachment('logo', true);

        if (!logo.contentType || !logo.contentType.startsWith('image/')) {
          return interaction.reply({ content: 'Logo must be an image attachment.', flags: MessageFlags.Ephemeral });
        }

        // Validate hex color if provided
        let newColor = config.embedColor;
        if (colorOpt) {
          const m = /^#?[0-9a-fA-F]{6}$/.test(colorOpt) ? colorOpt : null;
          if (!m) {
            return interaction.reply({ content: 'Invalid color format. Use hex like #2b6ef2.', flags: MessageFlags.Ephemeral });
          }
          newColor = colorOpt.startsWith('#') ? colorOpt : `#${colorOpt}`;
        }

        // Validate tx prefix
        let newPrefix = config.transactionIdPrefix;
        if (txPrefixOpt) {
          const ok = /^[A-Za-z0-9_-]{2,16}$/.test(txPrefixOpt);
          if (!ok) {
            return interaction.reply({ content: 'Invalid tx prefix. Use 2-16 characters A-Z 0-9 _ -', flags: MessageFlags.Ephemeral });
          }
          newPrefix = txPrefixOpt;
        }

        const newCfg = { ...config, brandName: name, brandLogo: logo.url, embedColor: newColor, transactionIdPrefix: newPrefix };
        saveConfig(newCfg);

        await interaction.reply({
          content: '✅ Brand updated successfully!\n' +
            `Brand name changed to ${name}.\n` +
            `Color set to ${newColor}.\n` +
            (txPrefixOpt ? `Transaction prefix set to ${newPrefix}.\n` : '') +
            'Logo has been updated.',
          ephemeral: false
        });
      } else if (['btc','ltc','eth','usdt','sol','xrp'].includes(interaction.commandName)) {
        if (!isAdmin(interaction.member)) {
          return interaction.reply({ content: 'You do not have permission to use this command.', flags: MessageFlags.Ephemeral });
        }

        const symbol = interaction.commandName.toUpperCase();
        const address = config.cryptoAddresses && config.cryptoAddresses[symbol];
        if (!address) {
          return interaction.reply({ content: `No ${symbol} address is configured.`, flags: MessageFlags.Ephemeral });
        }

        const qrUrl = `https://quickchart.io/qr?size=400&text=${encodeURIComponent(address)}`;
        const emoji = getSymbolEmoji(symbol) || '';
        const title = `${emoji ? `${emoji} ` : ''}${symbol} Address`;
        const embed = new EmbedBuilder()
          .setTitle(title)
          .setDescription('Use the address below to receive funds. A QR code is included for convenience.')
          .setColor(config.embedColor)
          .setFooter({ text: config.brandName, iconURL: config.brandLogo })
          .setThumbnail(qrUrl)
          .addFields({ name: 'Address', value: `\`${address}\``, inline: false });

        const copyEmoji = (config.buttonEmojis && config.buttonEmojis.copy) || undefined;
        const copyBtn = new ButtonBuilder()
          .setCustomId(`copy_addr:${symbol}`)
          .setLabel('Copy Address')
          .setStyle(ButtonStyle.Secondary);
        if (copyEmoji) copyBtn.setEmoji(copyEmoji);
        const row = new ActionRowBuilder().addComponents(copyBtn);

        // Public reply in channel
        return interaction.reply({ embeds: [embed], components: [row] });
      } else if (interaction.commandName === 'exchangers') {
        if (!isAdmin(interaction.member)) {
          return interaction.reply({ content: 'You do not have permission to use this command.', flags: MessageFlags.Ephemeral });
        }
        const sub = interaction.options.getSubcommand(true);
        if (sub === 'list') {
          const list = Array.isArray(config.exchangers) ? config.exchangers : [];
          const text = list.length ? list.map((id) => `<@${id}>`).join(', ') : 'No exchangers configured.';
          return interaction.reply({ content: text, flags: MessageFlags.Ephemeral });
        }
        const user = interaction.options.getUser('user', true);
        const set = new Set(Array.isArray(config.exchangers) ? config.exchangers : []);
        if (sub === 'add') {
          set.add(user.id);
          saveConfig({ ...config, exchangers: Array.from(set) });
          return interaction.reply({ content: `Added <@${user.id}> to exchangers.`, flags: MessageFlags.Ephemeral });
        }
        if (sub === 'remove') {
          set.delete(user.id);
          saveConfig({ ...config, exchangers: Array.from(set) });
          return interaction.reply({ content: `Removed <@${user.id}> from exchangers.`, flags: MessageFlags.Ephemeral });
        }
      }
      return;
    }

    // Component interactions
    if (interaction.isStringSelectMenu()) {
      const userId = interaction.user.id;
      const state = userFlowState.get(userId) || {};

      if (interaction.customId === 'send_method_select') {
        const selected = interaction.values[0];
        state.sendingMethod = selected;
        state.sendingCrypto = undefined;
        state.receivingMethod = undefined;
        state.receivingCrypto = undefined;
        userFlowState.set(userId, state);

        if (selected === 'Crypto') {
          const embed = new EmbedBuilder()
            .setTitle('What crypto are you sending?')
            .setDescription('You have selected Crypto as your sending payment method. Please select the type of crypto you are sending.')
            .setColor(config.embedColor)
            .setFooter({ text: config.brandName, iconURL: config.brandLogo });
          const row = buildCryptoSelect('crypto_type_select');
          return interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral });
        } else {
          const embed = new EmbedBuilder()
            .setTitle(`You have selected ${selected} as your sending payment.`)
            .setDescription('What would you like to receive?')
            .setColor(config.embedColor)
            .setFooter({ text: config.brandName, iconURL: config.brandLogo });
          const row = buildReceiveMethodSelect(selected);
          return interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral });
        }
      }

      if (interaction.customId === 'crypto_type_select') {
        const crypto = interaction.values[0];
        state.sendingCrypto = crypto;
        userFlowState.set(userId, state);

        const embed = new EmbedBuilder()
          .setTitle(`Sending via ${crypto}`)
          .setDescription(`You have selected ${crypto} as your sending payment. What would you like to receive?`)
          .setColor(config.embedColor)
          .setFooter({ text: config.brandName, iconURL: config.brandLogo });
        const row = buildReceiveMethodSelect('Crypto');
        return interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral });
      }

      if (interaction.customId === 'receive_method_select') {
        const receiveSelected = interaction.values[0];
        state.receivingMethod = receiveSelected;
        state.receivingCrypto = undefined;
        userFlowState.set(userId, state);

        if (receiveSelected === 'Crypto') {
          const embed = new EmbedBuilder()
            .setTitle('Receiving Crypto')
            .setDescription('You have selected Crypto as your receiving payment method. Please select the type of crypto you wish to receive.')
            .setColor(config.embedColor)
            .setFooter({ text: config.brandName, iconURL: config.brandLogo });
          const row = buildCryptoSelect('receive_crypto_type_select');
          return interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral });
        }

        // If receiving is non-crypto and sending is already set, open modal
        if (state.sendingMethod && (state.sendingMethod !== 'Crypto' || state.sendingCrypto)) {
          return interaction.showModal(amountModal());
        }

        return interaction.reply({ content: 'Sending method not set. Please start again.', flags: MessageFlags.Ephemeral });
      }

      if (interaction.customId === 'receive_crypto_type_select') {
        const crypto = interaction.values[0];
        state.receivingCrypto = crypto;
        userFlowState.set(userId, state);
        return interaction.showModal(amountModal());
      }

      return;
    }

    // Button interactions for ticket controls
    if (interaction.isButton()) {
      // Close button: remove user if it's the ticket owner, then prompt admins to delete
      if (interaction.customId === 'ticket_close') {
        const openerId = interaction.channel?.topic && interaction.channel.topic.startsWith('ticket:')
          ? interaction.channel.topic.split(':')[1]
          : null;

        // If the clicking user is the opener, remove their access
        if (openerId && interaction.user.id === openerId) {
          try {
            await interaction.channel.permissionOverwrites.edit(openerId, { ViewChannel: false });
          } catch {}
        }

        // Post delete prompt for admins
        const promptEmbed = new EmbedBuilder()
          .setTitle('Ticket Closure')
          .setDescription('Do you wish to delete this ticket?')
          .setColor(config.embedColor)
          .setFooter({ text: config.brandName, iconURL: config.brandLogo });
        return interaction.reply({ embeds: [promptEmbed], components: [buildDeletePromptRow()], ephemeral: false });
      }

      if (interaction.customId === 'ticket_delete_cancel') {
        // Only admins can cancel the delete prompt
        if (!isAdmin(interaction.member)) {
          return interaction.reply({ content: 'Only admins can cancel.', flags: MessageFlags.Ephemeral });
        }
        try {
          await interaction.update({ components: [buildDeletePromptRow(true)] });
        } catch {
          try { await interaction.message.edit({ components: [buildDeletePromptRow(true)] }); } catch {}
        }
        return;
      }

      if (interaction.customId === 'ticket_delete_confirm') {
        if (!isAdmin(interaction.member)) {
          return interaction.reply({ content: 'Only admins can delete tickets.', flags: MessageFlags.Ephemeral });
        }
        try {
          await interaction.update({ components: [buildDeletePromptRow(true)] });
        } catch {}
        try { await interaction.channel.delete('Ticket closed by admin'); } catch {}
        return;
      }

      if (interaction.customId && interaction.customId.startsWith('copy_addr:')) {
        const symbol = interaction.customId.split(':')[1];
        const address = config.cryptoAddresses && config.cryptoAddresses[symbol];
        if (!address) {
          return interaction.reply({ content: 'Address not found.', flags: MessageFlags.Ephemeral });
        }
        // Ephemeral reply so the user can copy easily
        return interaction.reply({ content: `Here is the ${symbol} address:\n\`${address}\``, flags: MessageFlags.Ephemeral });
      }
    }

    // Modal submit
    if (interaction.isModalSubmit() && interaction.customId === 'exchange_details_modal') {
      const userId = interaction.user.id;
      const state = userFlowState.get(userId);
      if (!state || !state.sendingMethod || !state.receivingMethod) {
        return interaction.reply({ content: 'Your session expired. Please start again with the menu.', flags: MessageFlags.Ephemeral });
      }

      const rawAmount = interaction.fields.getTextInputValue('amount_input');
      const amount = parseAmount(rawAmount);
      if (!Number.isFinite(amount) || amount <= 0) {
        return interaction.reply({ content: 'Please enter a valid amount greater than 0.', flags: MessageFlags.Ephemeral });
      }

      // Enforce minimum
      if (amount < 12.5) {
        return interaction.reply({ content: 'Minimum exchange amount is $12.50 USD.', flags: MessageFlags.Ephemeral });
      }

      const sending = state.sendingMethod === 'Crypto' && state.sendingCrypto ? `${state.sendingCrypto}` : state.sendingMethod;
      const receiving = state.receivingMethod === 'Crypto' && state.receivingCrypto ? `${state.receivingCrypto}` : state.receivingMethod;

      const { feePct, totalReceive } = calcAfterFees(amount, state.sendingMethod);

      // Create private channel
      const guild = interaction.guild;
      const everyone = guild.roles.everyone;
      const overwrites = [
        { id: String(everyone.id), type: OverwriteType.Role, deny: [PermissionsBitField.Flags.ViewChannel] },
        { id: String(interaction.user.id), type: OverwriteType.Member, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }
      ];
      
      // Add admin users - only add if they exist in the guild cache (to avoid errors)
      if (Array.isArray(config.adminIds)) {
        for (const adminId of config.adminIds) {
          const adminIdStr = String(adminId).trim();
          if (adminIdStr && /^\d+$/.test(adminIdStr) && adminIdStr !== String(interaction.user.id)) {
            // Only add if member is in cache to avoid resolution errors
            const cachedMember = guild.members.cache.get(adminIdStr);
            if (cachedMember) {
              overwrites.push({ id: adminIdStr, type: OverwriteType.Member, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] });
            }
          }
        }
      }
      
      // Add admin roles - only add if they exist in the guild cache
      if (config.adminRoles && Array.isArray(config.adminRoles) && config.adminRoles.length > 0) {
        for (const roleId of config.adminRoles) {
          const roleIdStr = String(roleId).trim();
          if (roleIdStr && /^\d+$/.test(roleIdStr)) {
            // Check if role exists in guild cache
            const role = guild.roles.cache.get(roleIdStr);
            if (role) {
              overwrites.push({ id: roleIdStr, type: OverwriteType.Role, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] });
            }
          }
        }
      }
      
      // Add support roles (owner, headExchangers, exchangers) - only if they exist in the guild cache
      if (config.supportRoles) {
        const supportRoleMentions = [
          config.supportRoles.owner,
          config.supportRoles.headExchangers,
          config.supportRoles.exchangers
        ].filter(Boolean); // Remove any undefined/null values
        
        for (const roleMention of supportRoleMentions) {
          // Extract role ID from mention format: <@&ROLE_ID> or just ROLE_ID
          const roleIdMatch = String(roleMention).match(/<@&?(\d+)>|(\d+)/);
          const roleIdStr = roleIdMatch ? (roleIdMatch[1] || roleIdMatch[2]) : null;
          
          if (roleIdStr && /^\d+$/.test(roleIdStr)) {
            // Check if role exists in guild cache
            const role = guild.roles.cache.get(roleIdStr);
            if (role) {
              // Check if this role is already in overwrites to avoid duplicates
              const alreadyAdded = overwrites.some(ow => String(ow.id) === roleIdStr);
              if (!alreadyAdded) {
                overwrites.push({ id: roleIdStr, type: OverwriteType.Role, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] });
              }
            }
          }
        }
      }

      const channelName = `exchange-${Math.floor(1000 + Math.random() * 9000)}`;
      let channel;
      try {
        channel = await guild.channels.create({
          name: channelName,
          type: ChannelType.GuildText,
          permissionOverwrites: overwrites,
          parent: config.ticketCategoryId && String(config.ticketCategoryId).trim() !== '' ? config.ticketCategoryId : undefined,
          topic: `ticket:${interaction.user.id}`
        });
      } catch (err) {
        console.error('Failed to create channel:', err);
        // Try creating without admin overwrites if that fails
        const basicOverwrites = [
          { id: String(everyone.id), type: OverwriteType.Role, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: String(interaction.user.id), type: OverwriteType.Member, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }
        ];
        channel = await guild.channels.create({
          name: channelName,
          type: ChannelType.GuildText,
          permissionOverwrites: basicOverwrites,
          parent: config.ticketCategoryId && String(config.ticketCategoryId).trim() !== '' ? config.ticketCategoryId : undefined,
          topic: `ticket:${interaction.user.id}`
        });
      }

      const embed = summaryEmbed(interaction.user, sending, receiving, amount, feePct, totalReceive);
      
      // Build role mentions from config (use full mentions as stored)
      const roleMentions = [];
      if (config.supportRoles) {
        if (config.supportRoles.owner) roleMentions.push(config.supportRoles.owner);
        if (config.supportRoles.headExchangers) roleMentions.push(config.supportRoles.headExchangers);
        if (config.supportRoles.exchangers) roleMentions.push(config.supportRoles.exchangers);
      }
      
      // Build message with role mentions
      let roleMentionText = '';
      if (roleMentions.length > 0) {
        if (roleMentions.length === 1) {
          roleMentionText = roleMentions[0];
        } else if (roleMentions.length === 2) {
          roleMentionText = `${roleMentions[0]} or ${roleMentions[1]}`;
        } else {
          const lastRole = roleMentions.pop();
          roleMentionText = `${roleMentions.join(', ')} or ${lastRole}`;
        }
      }
      
      const messageContent = roleMentionText 
        ? `Hey <@${interaction.user.id}>, please wait patiently for ${roleMentionText} to further assist you with your exchange request.`
        : `Hey <@${interaction.user.id}>, please wait patiently for a staff member to further assist you with your exchange request.`;
      
      await channel.send({ content: messageContent, embeds: [embed], components: [buildTicketControlsRow()] });

      userFlowState.delete(userId);
      return interaction.reply({ content: `Your exchange channel has been created: <#${channel.id}>`, flags: MessageFlags.Ephemeral });
    }
  } catch (err) {
    console.error('Interaction handler error:', err);
    if (interaction.isRepliable()) {
      try { await interaction.reply({ content: 'Something went wrong. Please try again.', flags: MessageFlags.Ephemeral }); } catch {}
    }
  }
});

// Login
if (!process.env.DISCORD_BOT_TOKEN) {
  console.error('Missing DISCORD_BOT_TOKEN in environment.');
  process.exit(1);
}
client.login(process.env.DISCORD_BOT_TOKEN);


