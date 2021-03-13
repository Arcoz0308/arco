import ArcoClient from "../base/Client";
import {Message as m} from 'discord.js'

export default class Message {
    name = 'message';

    client: ArcoClient;
    constructor(client: ArcoClient) {
        this.client = client;
    }
    async run(message: m) {
        // return if is a bot message
        if(message.author.bot) return;

        // get the prefix
        let prefix: string;
        if(message.guild) prefix = message.guild.prefix || '*';
        else prefix = '*';

        // level system
        if(message.guild && message.member && message.guild.levelManager.enable) {
            if(Date.now() - message.member.cooldown < 15 * 1000) return;
            let xp = (Math.floor((Math.random() * ( Math.floor(10) - Math.ceil(5))) + Math.ceil(5)) * message.guild.levelManager.hard / 2);
            let x = message.member.addXp(xp);
            message.member.cooldown = Date.now();

            // if the member level up
            if(x.levelUp) {
                let text = message.guild.levelManager.getLevelUpMessage();
                text = text.replace('{USER_PING}', message.author.toString());
                text = text.replace('{LEVEL}', x.newLevel);
                message.channel.send(text);
            }
        }
    }
}