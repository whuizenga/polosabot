const roles = {
  pf: {
    name: 'Party Finder',
    roleId: '841727270976225280',
    emojiId: '<:pf:888212102479757353>',
  },
  expert: {
    name: 'Expert Roulette',
    roleId: '888199752305483876',
    emojiId: '<:expert:888214378971811870>',
  },
  roulettes: {
    name: 'Roulettes',
    roleId: '883924511827836928',
    emojiId: '<:roulettes:888211646370164747>',
  },
}

const ffxivReactionRole = {
  name: 'ffxivreactionrole',
  description: 'Sets up the ffxiv reaction role message',
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
        .setTitle('FFXIV Roles')
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


module.exports = ffxivReactionRole
