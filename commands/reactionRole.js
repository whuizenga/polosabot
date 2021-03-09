const roles = {
  ffxiv: {
    name: 'Final Fantasy XIV',
    roleId: '647602091954798592',
  },
  gi: {
    name: 'Genshin Impact',
    roleId: '762401905590009866',
  },
  vh: {
    name: 'Valheim',
    roleId: '812069893113511989',
  },
  acnh: {
    name: 'Animal Crossing',
    roleId: '701502327412097065',
  },
  wowclassic: {
    name: 'Wow Classic',
    roleId: '818970275181756477',
  },
  wow: {
    name: 'World of Warcraft',
    roleId: '641367893828960256',
  },
  ow: {
    name: 'Overwatch',
    roleId: '818970072361205760',
  },
  lol: {
    name: 'League of Legends',
    roleId:'818969917499768842',
  },
}

const reactionRole = {
  name: 'reactionrole',
  description: 'Sets up the reaction role message',
  execute: async (message, args, Discord, client) => {
    const channel = '730498069396979857';
    const testRole = message.guild.roles.cache.find(role => role.id === '818981503642894366')

    const testRoleEmoji = message.guild.emojis.cache.find(emoji => emoji.name === 'ffxiv')

    const embed = new Discord.MessageEmbed()
      .setColor('#e42643')
      .setTitle('Get the test role!')
      .setDescription('React with :ffxiv: to get the test role!')

    const messageEmbed = await message.channel.send(embed)
    messageEmbed.react(testRoleEmoji)

    client.on('messageReactionAdd', async(reaction, user) => {
      if (reaction.message.partial) await reaction.message.fetch()
      if (reaction.partial) await reaction.fetch()
      if (user.bot) return
      if (!reaction.message.guild) return

      if (reaction.message.channel.id === channel) {
        if (reaction.emoji.name === testRoleEmoji.name) {
          await reaction.message.guild.members.cache.get(user.id).roles.add(testRole)
        }
      }
    })

    client.on('messageReactionRemove', async(reaction, user) => {
      if (reaction.message.partial) await reaction.message.fetch()
      if (reaction.partial) await reaction.fetch()
      if (user.bot) return
      if (!reaction.message.guild) return

      if (reaction.message.channel.id === channel) {
        if (reaction.emoji.name === testRoleEmoji.name) {
          await reaction.message.guild.members.cache.get(user.id).roles.remove(testRole)
        }
      }
    })
  }
}

module.exports = reactionRole
