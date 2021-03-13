import { Structures, Message, DMChannel, TextChannel, NewsChannel} from 'discord.js';
import ArcoClient from '../Client';
import { langManager } from '../managers/LangManager';

export class ArcoMessage extends Message {

    public lang: string = this.guild ? this.guild.lang : 'fr';

    public langManager = langManager;

    constructor(client: ArcoClient, data: object, channel: DMChannel | TextChannel | NewsChannel) {
    
        super(client, data, channel);
    }
    translate(path: string, options = {}): string {
        return this.langManager.getText(this.lang, path, options);
    }
}
Structures.extend('Message', Message => {
        return ArcoMessage;
    })