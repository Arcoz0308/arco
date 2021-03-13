import {
    Client,
    Collection
} from 'discord.js';
import {Emote} from './interfaces/Emote';
import {Command} from './Command';
import DataBaseManager from './managers/DataBaseManager';
import * as fs from 'fs';
import * as path from 'path';


export default class ArcoClient extends Client {

    public emotes = Emote;

    public commands = new Collection<string, Command>();

    public aliases = new Collection<string, Command>();

    public db = new DataBaseManager();

    constructor() {
        super({});
        require('../utils/Extenders');
    }
    
    loadEvents() {
        fs.readdirSync(path.resolve(__dirname, '../events')).forEach(f => {
            if(f.endsWith('.ts')) {
                let event = new (require(path.resolve(__dirname, '../events' + f)))(this);
                this.on(event.name, event.run.bind(null))
            }
        })
    }
    setUpCommands() {
        fs.readdirSync(path.resolve(__dirname, '../commands')).forEach(dir => {
            const commands = fs.readdirSync(path.resolve(__dirname, `../commands/${dir}/`)).filter(c => c.endsWith('.ts'));
            for (const command of commands) {
                this.loadCommand(path.resolve(__dirname, `../commands/${dir}/${command}`))
            }
        })
    }
    loadCommand(cmdpath: string): {name: string, aliases: string[]}|boolean {
        try {
         const rcmd = require(cmdpath);
         const cmd = new rcmd(this);
         if(cmd instanceof Command) {
             const ob = {name: cmd.name, aliases: cmd.aliases};
             this.commands.set(cmd.name, cmd);

             if(cmd.aliases[0]) {
                 cmd.aliases.forEach(a => {
                    this.aliases.set(a, cmd);
                 })
             }
             return ob;
         } else return false;

        } catch (error) {
          console.log(`failled to load command "${cmdpath}" Error: ${error}`);  
          return false;
        }
    }
    unloadCommand(command: Command) {
        try {
            if(command.aliases[0]) {
                command.aliases.forEach(a => {
                    this.aliases.delete(a);
                })
                this.commands.delete(command.name);
                delete require.cache[require.resolve(command.filePath)]
            }
        } catch (error) {
            console.log(`failled to load command "${command.filePath}" Error: ${error}`);
        }
    }
    
    
    
}