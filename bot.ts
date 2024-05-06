import { Bot } from 'grammy'
import { OpenAI } from 'openai'
import 'dotenv/config'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
})

const getObjectsInPhoto = async (imageUrl: string) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-1106-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'O que tem nessa imagem? Responsa apenas uma lista.'
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl
            }
          }
        ]
      }
    ]
  })

  return response.choices[0].message.content
}

const token = process.env.BOT_TOKEN!
// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(token) // <-- put your bot token between the ""

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Handle the /start command.
bot.command('start', ctx => ctx.reply('Welcome! Up and running.'))
// Handle other messages.
bot.on('message', async ctx => {
  // console.dir(ctx.chat, { depth: true })
  // console.log()

  ctx.reply('Got another message!')

  if (ctx.from.username != 'maykbrito') {
    return
  }

  const photo = ctx.message.photo
  if (!photo) return

  const file = await ctx.getFile()

  const downloadLink = `https://api.telegram.org/file/bot${token}/${file.file_path}`

  const response = await getObjectsInPhoto(downloadLink)

  ctx.reply(response!)
})

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start()
