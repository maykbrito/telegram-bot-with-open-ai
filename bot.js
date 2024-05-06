"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const openai_1 = require("openai");
require("dotenv/config");
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_KEY
});
const getObjectsInPhoto = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield openai.chat.completions.create({
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
    });
    return response.choices[0].message.content;
});
const token = process.env.BOT_TOKEN;
// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new grammy_1.Bot(token); // <-- put your bot token between the ""
// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.
// Handle the /start command.
bot.command('start', ctx => ctx.reply('Welcome! Up and running.'));
// Handle other messages.
bot.on('message', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    // console.dir(ctx.chat, { depth: true })
    // console.log()
    ctx.reply('Got another message!');
    if (ctx.from.username != 'maykbrito') {
        return;
    }
    const photo = ctx.message.photo;
    if (!photo)
        return;
    const file = yield ctx.getFile();
    const downloadLink = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
    const response = yield getObjectsInPhoto(downloadLink);
    ctx.reply(response);
}));
// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.
// Start the bot.
bot.start();
