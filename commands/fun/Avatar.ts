import { strict } from "assert";
import { Message, User } from "discord.js";
import ArcoClient from "../../base/Client";
import { Command } from "../../base/Command";

export default class Avatar extends Command {
    constructor(client: ArcoClient) {
        super(client, {
            name: 'avatar',
            description: 'commands/fun/avatar:DESCRIPTION',
            filePath: __filename,
            category: 'fun',
            usage: 'commands/fun/avatar:USAGE',
            exemple: 'commands/fun/avatar:EXEMPLE',
            aliases: ['pp']
        })
    }
    run(message: Message, args: string[]) {
        try {
            this.findUser(message, args.join(' ')).then(u => {
                message.channel.send({embed: {
                    title: message.translate('commands/fun/avatar:TITLE', {USER_TAG: u.tag}),
                    image: {
                        url:  u.avatarURL({dynamic: true, size: 2048, format: 'png'})!
                    },
                    color: 'ORANGE',
                    timestamp: Date.now(),
                    footer: {
                        text: `${message.author.tag} | ${this.name}`
                    }
                }})
            }).catch(e => {
                if(e instanceof Error && e.name === 'NO_USER_FOUND') {
                    return this.sendErrorMessage(message, message.translate('commands/findusers:UNKNOW_USER', {
                        USER: args.join(' ')
                    }));
                } else return;
            })
        } catch (error) {
            console.log(error);
        }
    }
}