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
  pokemon: {
    name: 'Pokémon',
    roleId:'881390854521114655',
    emojiId: '<:pokemon:888209291343986738>',
  },
  fhx: {
    name: 'FHX',
    roleId:'1014242805939449867',
    emojiId: '<:fhx:1017276973669679145>',
  },
  pf: {
    name: 'FFXIV: Party Finder',
    roleId: '841727270976225280',
    emojiId: '<:pf:888212102479757353>',
  },
  expert: {
    name: 'FFXIV: Expert Roulette',
    roleId: '888199752305483876',
    emojiId: '<:expert:888214378971811870>',
  },
  roulettes: {
    name: 'FFXIV: Roulettes',
    roleId: '883924511827836928',
    emojiId: '<:roulettes:888211646370164747>',
  },
}

const gamerRole = '836630061675184179'

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
            await reaction.message.guild.members.cache.get(user.id).roles.add(gamerRole)
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
              if(reaction.message.guild.members.cache.get(user.id).roles.cache.some(role=>['ffxiv','wow','acnh','pokemon','fhx',].includes(role.name)) === true)  {
                  await reaction.message.guild.members.cache.get(user.id).roles.add(gamerRole)
                }
                else {
                  await reaction.message.guild.members.cache.get(user.id).roles.remove(gamerRole)
                }
            }
          }
        }
      }
    })
  }
}

module.exports = reactionRole
