const helloCommand = {
  name: 'hello',
  description: 'Responds to the user saying Hello',
  execute: (message) => {
    message.reply('Привет!')
  }
}

module.exports = helloCommand
