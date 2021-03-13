import { Guild } from "discord.js";
import { type } from "os";
import ArcoClient from "../Client";
import LevelManager from "../managers/LevelManager";
interface GuildDB {
    id: string;
    param_name: GuildDBKeys;
    param_value: any;
}
type GuildDBKeys = 'prefix'|'lang'|'level';
export interface GuildOptions {
    prefix?: string;
}
export class ArcoGuild extends Guild {

    private data: GuildOptions = {};

    public  lang: string = 'fr';

    public levelManager: LevelManager|false = false;

    public  levels: object = {};

    constructor(client: ArcoClient, data = {}) {
        super(client, data);
        
        this.client.db.con.query(`SELECT * FROM guildinfo WHERE id='${this.id}'`, (error: any, result?: GuildDB[], f?: any) => {
            if(error) console.error(`error on db of the server ${this.name} (${this.id}), error message : ${error}`);
            if(result && result !== [] && result[0]) {
                result.forEach(o=> {
                    switch(o.param_name) {
                    case "prefix":
                        this.data.prefix = o.param_value[0];
                        break;
                    case "lang":
                        this.lang = o.param_value[0];
                        break;
                    case "level":
                        this.levelManager = new LevelManager(this, o.param_value);
                        break;
                    }
                });
            }
        });
        if(!this.levelManager) this.levelManager = new LevelManager(this, {});
        
    }
    get prefix(): string {
        return this.data.prefix && typeof this.data.prefix !== 'undefined' ? this.data.prefix : '*';
    }
    set prefix(v: string) {
        if(v.length > 3) return;
        if(this.data.prefix === v) return;
        if(this.data.prefix === '*') {
            
        } else if(v === '*') {

        } else {
            this._uptadeDBValue('prefix', `[${v}]`);
        }
    }
    private _uptadeDBValue(key: GuildDBKeys, value: any) {
        this.client.db.con.query(`UPDATE guildinfo SET ${key}='${value}' WHERE id='${this.id}'`, (err, result, field) => {
            if(err) console.log(err);
        })
    }
    private _createDBValue(key: GuildDBKeys, value: any) {
        this.client.db.con.query(`INSERT INTO guildinfo (id, param_name, param_value) VALUES ('${this.id}', '${key}', '${value}')`, (err, result, field) => {
            if(err) console.log(err);
        })
    }
    

}