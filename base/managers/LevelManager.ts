import { DMChannel, TextChannel } from "discord.js";
import { type } from "os";
import { ArcoGuild } from "../structures/Guild";
import { ArcoGuildMember } from "../structures/GuildMember";
import { langManager } from "./LangManager";
export interface LevelManagerOptions {
    enable?: boolean;
    levelUpMessage?: string;
    levelUpChannel?: string;
    hard?: number;
    delBeforeRoleReward?: boolean;
    rewars?:  {
        [n: number]: string;
        }
}
export default class LevelManager {
    public enable: boolean;
    public levelUpMessage: string|null;
    public levelUpChannel: string;
    public guild: ArcoGuild;

    constructor(guild: ArcoGuild, data: LevelManagerOptions) {
        this.guild = guild;
        this.enable = typeof data.enable !== 'undefined' && data.enable ? true : false;
        this.levelUpMessage = typeof data.levelUpMessage !== 'undefined' && data.levelUpMessage ? data.levelUpMessage : null;
        this.levelUpChannel = typeof data.levelUpChannel !== 'undefined' && data.levelUpChannel ? data.levelUpChannel : 'default';

    }
    async sendLevelUpMessage(channel: TextChannel, member: ArcoGuildMember) {
        let sendChannel: TextChannel|DMChannel;
        switch(this.levelUpChannel) {
            case "dm":
                sendChannel = await member.createDM();
                break;
            case "default":
                sendChannel = channel;
                break;
            default:
                if(!this.guild.channels.cache.has(this.levelUpChannel) || this.guild.channels.cache.get(this.levelUpChannel)?.type !== 'text') return;
                sendChannel = this.guild.channels.cache.get(this.levelUpChannel)! as TextChannel;
                break;
        }
        let text = this.levelUpMessage ? this.formateLevelUpMessage(member) : langManager.getText(this.guild.lang, 'level:LEVEL_UP', {
            USER_PING: member.toString(),
            LEVEL: member.level
        });
    }
    formateLevelUpMessage(member: ArcoGuildMember): string {
        let text = this.levelUpMessage!.split('{LEVEL}').join(`${member.level}`).split('{USER_MENTION}').join(member.toString()).split('{USER_TAG}').join(member.user.tag);
        return text;
    }

}