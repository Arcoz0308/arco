import * as Discord from 'discord.js';
export type CommandCategory = 'owner'|'unknow'|'administration'|'moderation'|'fun'|'level'|'utility';

/**
 * Command Options 
 */
export interface CommandOptions {
    name: string;
    description: string;
    filePath: string;
    aliases?: string[];
    category?: CommandCategory;
    usage: string;
    exemple: string;
    guildOnly?: boolean;
    permissions?: Discord.PermissionResolvable[];
    botPermissions?: Discord.PermissionResolvable[];
    ownerOnly?: boolean;
}
export interface Runable {
    run(message: Discord.Message, args: string[]): void;
}