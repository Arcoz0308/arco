import {
    CommandCategory,
    CommandOptions,
    Runable
} from './interfaces/CommandInterfaces';
import * as Discord from 'discord.js';
import ArcoClient from './Client';

export class Command implements Runable {

    public readonly client: ArcoClient;
    
    public name: string;

    public filePath: string;

    public description: string;

    public aliases: string[] = [];

    public category: CommandCategory;

    public usage: string;

    public exemple: string;

    public guildOnly: boolean = false;

    public permissions: Discord.PermissionResolvable[] = [];

    public botPermissions: Discord.PermissionResolvable[] = [];

    public ownerOnly: boolean = false;

    constructor(client: ArcoClient,  options: CommandOptions) {

        this.client = client;

        this.name = options.name;

        this.description = options.description;
        
        this.filePath = options.filePath;

        this.aliases = typeof options.aliases !== 'undefined' ? options.aliases : [];

        this.category = typeof options.category !== 'undefined' ? options.category : 'unknow';

        this.usage = options.usage;

        this.exemple = options.exemple;

        this.guildOnly = options.guildOnly === true;

        this.permissions = typeof options.permissions !== 'undefined' ? options.permissions : [];

        this.botPermissions = typeof options.botPermissions !== 'undefined' ? options.botPermissions : [];
        
        this.ownerOnly = options.ownerOnly === true;

        
    }
    run(message: Discord.Message, args: string[]): void {
        console.log('no run for ' + this.name);
    }

    sendErrorMessage(message: Discord.Message, error: string,): void {
        message.channel.send({embed: {
            title: this.client.emotes.warning + message.translate('commands/base:ERROR'),
            description: error,
            color: 'ORANGE',
            timestamp: Date.now(),
            footer: {
                text: `${message.author.tag} | ${this.name}`
            }
        }});
    }
    async findMember(message: Discord.Message, userstring: string): Promise<Discord.GuildMember> {
        return new Promise(async (resolve, reject) => {
            if(message.mentions.members && typeof message.mentions.members.first() !== 'undefined') return resolve(message.mentions.members.first()!); 
                let members = this._findMemberByString(message.guild!, userstring);
                if(!members) return reject(new Error('NO_MEMBER_FOUND'));
                if(!Array.isArray(members)) return resolve(members);
                else this.choseUser(message, members).then(g => {
                    return resolve(g);
                }).catch(e => {
                    return reject(e);
                })
        })
    }
    async findUser(message: Discord.Message, userstring: string): Promise<Discord.User> {
        return new Promise(async (resolve, reject) => {  
            if(message.mentions.users && typeof message.mentions.users.first() !== 'undefined') return resolve(message.mentions.users.first()!)
            if(message.guild) {
                let members = this._findMemberByString(message.guild, userstring);
                if(!members) {
                    this._findUserByString(userstring).then(u => {
                        if(u) return resolve(u);
                        return reject(new Error('NO_USER_FOUND'));
                    }).catch(e => {
                        return reject(new Error('NO_USER_FOUND'));
                    })
                } else {
                    if(!Array.isArray(members)) return resolve(members.user);
                    else {
                        this.choseUser(message, members).then(g => {
                            return resolve(g.user);
                        }).catch(e => {
                            return reject(e);
                        })
                    }
                }
            }
        })
    }
    private _findMemberByString(guild: Discord.Guild, string: string): Discord.GuildMember|Discord.GuildMember[]|null {
        if(typeof string !== 'string') return null;
        let founds = guild.members.cache.filter(g => g.user.tag.toLowerCase().includes(string.toLowerCase()) || g.displayName.toLowerCase().includes(string.toLowerCase()));
        let found = guild.members.cache.has(string) ? guild.members.cache.get(string) : null;
        if(founds.size === 0 && !found) return null;
        if(found) return found;
        if(founds.size === 1) return founds.first()!;
        return founds.array();
    }
    private _findUserByString(string: string): Promise<Discord.User|null> {
        return new Promise((resolve, reject) => {
            if(this.client.users.cache.has(string)) return resolve(this.client.users.cache.get(string)!);
            this.client.users.fetch(string).catch(e => {
                return reject(new Error('NO_USER_FOUND'));
            })
            .then(u => {
                if(u) return resolve(u);
                return null;
            })
        })
    }

     choseUser(message: Discord.Message, members: Discord.GuildMember[]): Promise<Discord.GuildMember> {
        return new Promise((resolve, reject) => {
            if (members.length > 9) {
                this.sendErrorMessage(message, message.translate("commands/findusers:TO_MANY_USERS"));
                return reject(new Error('TO_MANY_MEMBERS'));
            }

            const list: string[] = [];
            const users: Discord.GuildMember[] = [];

            members.forEach((g, i) => {
                list[i] = `${i + 1} - ${g.displayName} | ${g.user.tag}`;
                users[i] = g;
            })

            message.channel.send({
                embed: {
                    title: this.name,
                    color: 'ORANGE',
                    description: `${message.translate("commands/findusers:CHOSE_CONTENT")} \n ${list.join('\n')}`,
                    timestamp: Date.now(),
                    footer: {
                        text: `${message.author} | ${this.name}`
                    }
                }
            })
                .then(message => {
                    if (!message) return reject(new Error('Unknow Error'));

                    const emotes: object = {};
                    for (let i: 1|2|3|4|5|6|7|8|9 = 1; i < users.length; i++) {
                        message.react(this.client.emotes.numbers[i])
                            .catch(e => { });
                    }

                    message.react(this.client.emotes.cancel)
                        .catch(e => { });
                    emotes[this.client.emotes.cancel] = true;

                    const filder = (reaction: Discord.MessageReaction, user: Discord.User) => reaction.emoji.name in emotes && user.id === message.author.id;

                    const collector = new Discord.ReactionCollector(message, filder, { time: 60000, maxEmojis: 1 });
                    collector
                        .on('collect', reaction => {
                            if (reaction.emoji.name === this.client.emotes.cancel) {
                                message.edit({
                                    embed: {
                                        title: this.name,
                                        description: message.translate("commands/findusers:CANCEL"),
                                        color: 'ORANGE',
                                        timestamp: Date.now(),
                                        footer: {
                                            text: `${message.author} | ${this.name}`
                                        }
                                    }
                                })
                                    .catch(e => { });

                                message.reactions.removeAll()
                                    .catch(e => { });

                                collector.stop('CANCELED');
                                return reject(new Error('CANCELED'));
                            } else {
                                collector.stop('RESOLVED');

                                message.delete().catch(e => { });
                                return resolve(emotes[reaction.emoji.name] as Discord.GuildMember);
                            }
                        })
                        .on('end', (_, reason) => {
                            if (reason === 'time') {
                                message.edit({
                                    embed: {
                                        title: this.name,
                                        description: message.translate("commands/findusers:TIMEOUT"),
                                        color: 'ORANGE',
                                        timestamp: Date.now(),
                                        footer: {
                                            text: `${message.author} | ${this.name}`
                                        }
                                    }
                                })
                                    .catch(e => { });

                                message.reactions.removeAll()
                                    .catch(e => { });
                                return reject(new Error('TIMEOUt'));
                            }
                        })

                })
        });
    }
    toString() {
        return this.name;
    }

}