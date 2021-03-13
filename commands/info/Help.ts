import { Message } from "discord.js";
import ArcoClient from "../../base/Client";
import { Command } from "../../base/Command";

export default class Help extends Command {
    constructor(client: ArcoClient) {
        super(client, {
            name: 'help',
            filePath: __filename,
            description: 'path',
            category: 'unknow',
            usage: 'path',
            exemple: 'path'
            
        });
    }
    run(message: Message, args: string[]) {
         
    }
}