import { Message, MessageReaction, TextChannel, User } from "discord.js";
import { send } from "process";
import ArcoClient from "../../base/Client";
import { Command } from "../../base/Command";

export default class Clear extends Command {
    constructor(client: ArcoClient) {
        super(client, {
            name: 'clear',
            filePath: __filename,
            description: 'commands/moodo/clear:DESCRIPTION',
            category: 'moderation',
            usage: 'commands/modo/clear:USAGE',
            exemple: 'commands/modo/clear:EXEMPLE',
            guildOnly: true,
            permissions: ['MANAGE_MESSAGES'],
            botPermissions: ['MANAGE_MESSAGES']            
        });
    }
    async run(message: Message, args: string[]) {
        const channel = message.channel as TextChannel;
        if(args[0] === 'all') {
            if(!message.guild!.me!.hasPermission('MANAGE_CHANNELS')) return;
            if(!message.member!.hasPermission('MANAGE_CHANNELS')) return;
            const messageconfirm = await message.channel.send({embed: {
                title: 'clear all',
                description: message.translate('commands/modo/clear:CONFIRM_ALL'),
                color: 'ORANGE',
                timestamp: Date.now(),
                footer: {
                    text: `${message.author.tag} | ${this.name}`
                }
            }})
            await messageconfirm.react(this.client.emotes.confirm);
            await messageconfirm.react(this.client.emotes.cancel);
            const filter = (r: MessageReaction, u: User) => {
                return u.id === message.author.id && (r.emoji.name === this.client.emotes.cancel || r.emoji.name === this.client.emotes.confirm);
            }
            const c = await messageconfirm.createReactionCollector(filter, {time: 60000});
            c.on('collect', async r => {
                if(r.emoji.name === this.client.emotes.confirm) {
                    const position =  channel.position;
                    const newChannel = await channel.clone();
                    c.stop('confirm');
                    await channel.delete();
                    newChannel.setPosition(position);
                    return newChannel.send({embed: {
                        title: 'clear all',
                        description: message.translate('commands/modo/clear:CLEARED_CHANNEL'),
                        color: 'ORANGE',
                        timestamp: Date.now(),
                        footer: {
                            text: `${message.author.tag} | ${this.name}`
                        }
                    }}).then(m => m.delete({timeout: 30000}));
                } else {
                    c.stop('cancel');
                    return messageconfirm.edit({embed: {
                        title: 'clear all',
                        description: message.translate('commands/findusers:CANCEL'),
                        color: 'ORANGE',
                        timestamp: Date.now(),
                        footer: {
                            text: `${message.author.tag} | ${this.name}`
                        }
                    }});
                }
            });
            c.on('end', (c, r) => {
                if(r === 'time') {
                    return messageconfirm.edit({embed: {
                        title: 'clear all',
                        description: message.translate('commands/findusers:TIMEOUT'),
                        color: 'ORANGE',
                        timestamp: Date.now(),
                        footer: {
                            text: `${message.author.tag} | ${this.name}`
                        }
                    }});
                }
            })
        }
        if(!args || !args[0]) return this.sendErrorMessage(message, message.translate('commands/modo/clear:ERROR_NO_ARGS'));
        const amount = Number(args[0]);
        if(amount < 2 || amount > 100) return this.sendErrorMessage(message, message.translate('commands/modo/clear:ERROR_FALSE_ARG'));
        let messagesex = await message.channel.messages.fetch({limit: amount});
        let messages = messagesex.array();
        messages = messages.filter(m => !m.pinned);
        let msgs = await channel.bulkDelete(messages, true);
        if(messages.length < msgs.size) {

        } else {

        }
        
    }
}
