const roles = {
  ffxiv: {
    name: 'Final Fantasy XIV',
    roleId: '647602091954798592',
    emojiId: '<:ffxiv:818980250733117481>',
  },
  gi: {
    name: 'Genshin Impact',
    roleId: '762401905590009866',
    emojiId: '<:gi:818980262696321044>',
  },
  vh: {
    name: 'Valheim',
    roleId: '812069893113511989',
    emojiId: '<:vh:818980267440078859>',
  },
  acnh: {
    name: 'Animal Crossing',
    roleId: '701502327412097065',
    emojiId: '<:acnh:818984760998101012>',
  },
  wow: {
    name: 'World of Warcraft',
    roleId: '641367893828960256',
    emojiId: '<:wow:818980256408010773>',
  },
  wowclassic: {
    name: 'WoW Classic',
    roleId: '818970275181756477',
    emojiId: '<:wowclassic:818981156393058306>',
  },
  ow: {
    name: 'Overwatch',
    roleId: '818970072361205760',
    emojiId: '<:ow:818980254575362049>',
  },
  lol: {
    name: 'League of Legends',
    roleId:'818969917499768842',
    emojiId: '<:lol:818980264083980318>',
  },
}

const reactionRole = {
  name: 'reactionrole',
  description: 'Sets up the reaction role message',
  execute: async (message, createMessage = false, Discord, client) => {
    const channel = process.env.REACTION_CHANNEL_ID

    const guild = client.guilds.cache.get(process.env.SERVER_ID)

    Object.values(roles).forEach((role) => {
      const guildRole = guild.roles.cache.find(r => r.id === role.roleId)

      if (!guildRole) {
        console.log(`Failed to find Role for ${role.name}`)
      } else {
        role.role = guildRole
      }
    })

    if (createMessage || (message.channel && message.channel.id !== channel)) {
      const roleMessages = Object.values(roles).map(role => (
        `**${role.emojiId} ${role.name}**`
      ))

      const embed = new Discord.MessageEmbed()
        .setColor('#e42643')
        .setTitle('Roles')
        .setDescription(
          'React below to get a role\n\n' + roleMessages.join('\n')
        )
  
      const messageEmbed = await message.channel.send(embed)

      Object.values(roles).forEach((role) => {
        messageEmbed.react(role.emojiId)
      })
    }

    client.on('messageReactionAdd', async(reaction, user) => {
      if (reaction.message.partial) await reaction.message.fetch()
      if (reaction.partial) await reaction.fetch()
      if (user.bot) return
      if (!reaction.message.guild) return

      if (reaction.message.channel.id === channel) {
        if (roles[reaction.emoji.name]) {
          const role = roles[reaction.emoji.name]

          if (role.emojiId.includes(reaction.emoji.id)) {
            await reaction.message.guild.members.cache.get(user.id).roles.add(role.role)
          }
        }
      }
    })

    client.on('messageReactionRemove', async(reaction, user) => {
      if (reaction.message.partial) await reaction.message.fetch()
      if (reaction.partial) await reaction.fetch()
      if (user.bot) return
      if (!reaction.message.guild) return

      if (reaction.message.channel.id === channel) {
        if (reaction.message.channel.id === channel) {
          if (roles[reaction.emoji.name]) {
            const role = roles[reaction.emoji.name]
  
            if (role.emojiId.includes(reaction.emoji.id)) {
              await reaction.message.guild.members.cache.get(user.id).roles.remove(role.role)
            }
          }
        }
      }
    })
  }
}

module.exports = reactionRole
