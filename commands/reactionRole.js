const roles = {
  ffxiv: {
    name: 'Final Fantasy XIV',
    roleId: '647602091954798592',
    emojiText: 'ffxiv',
  },
  gi: {
    name: 'Genshin Impact',
    roleId: '762401905590009866',
    emojiText: 'gi',
  },
  vh: {
    name: 'Valheim',
    roleId: '812069893113511989',
    emojiText: 'vh',
  },
  acnh: {
    name: 'Animal Crossing',
    roleId: '701502327412097065',
    emojiText: 'acnh',
  },
  wow: {
    name: 'World of Warcraft',
    roleId: '641367893828960256',
    emojiText: 'wow',
  },
  wowclassic: {
    name: 'WoW Classic',
    roleId: '818970275181756477',
    emojiText: 'wowclassic',
  },
  ow: {
    name: 'Overwatch',
    roleId: '818970072361205760',
    emojiText: 'ow',
  },
  lol: {
    name: 'League of Legends',
    roleId:'818969917499768842',
    emojiText: 'lol',
  },
}

const reactionRole = {
  name: 'reactionrole',
  description: 'Sets up the reaction role message',
  execute: async (message, args, Discord, client) => {
    const channel = process.env.REACTION_CHANNEL_ID

    Object.values(roles).forEach((role) => {
      role.role = message.guild.roles.cache.find(r => r.id === role.roleId)
      role.emoji = message.guild.emojis.cache.find(e => e.name === role.emojiText)
      console.log(role.emoji)
    })

    const roleMessages = Object.values(roles).map(role => (
      `**<:${role.emojiText}:${role.emoji.id}> ${role.name}**`
    ))

    const embed = new Discord.MessageEmbed()
      .setColor('#e42643')
      .setTitle('Roles')
      .setDescription(
        'React below to get a role\n\n' + roleMessages.join('\n')
      )

    const messageEmbed = await message.channel.send(embed)

    Object.values(roles).forEach((role) => {
      messageEmbed.react(role.emoji)
    })

    client.on('messageReactionAdd', async(reaction, user) => {
      if (reaction.message.partial) await reaction.message.fetch()
      if (reaction.partial) await reaction.fetch()
      if (user.bot) return
      if (!reaction.message.guild) return

      if (reaction.message.channel.id === channel) {
        if (reaction.emoji.name === (roles[reaction.emoji.name] && roles[reaction.emoji.name].emojiText)) {
          await reaction.message.guild.members.cache.get(user.id).roles.add(roles[reaction.emoji.name].role)
        }
      }
    })

    client.on('messageReactionRemove', async(reaction, user) => {
      if (reaction.message.partial) await reaction.message.fetch()
      if (reaction.partial) await reaction.fetch()
      if (user.bot) return
      if (!reaction.message.guild) return

      if (reaction.message.channel.id === channel) {
        if (reaction.emoji.name === (roles[reaction.emoji.name] && roles[reaction.emoji.name].emojiText)) {
          await reaction.message.guild.members.cache.get(user.id).roles.remove(roles[reaction.emoji.name].role)
        }
      }
    })
  }
}

module.exports = reactionRole
