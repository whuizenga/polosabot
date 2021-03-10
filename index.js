require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"]})

client.commands = new Discord.Collection()
const commands = require('./commands')

commands.forEach((command) => {
  client.commands.set(command.name, command)
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  client.commands.get('reactionrole').execute({}, false, Discord, client)
})

const prefix = '!'

client.on('message', msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return

  const args = msg.content.slice(prefix.length).split(/ +/)
  const command = args.shift().toLowerCase()

  switch(command) {
    case 'hello':
      client.commands.get('hello').execute(msg, args)
      break
    case 'reactionrole':
      client.commands.get('reactionrole').execute(msg, true, Discord, client)
      break
    default:
      console.log(`Command "${command}" not found.`)
  }
})

const token = process.env.DISCORD_TOKEN
client.login(token)
