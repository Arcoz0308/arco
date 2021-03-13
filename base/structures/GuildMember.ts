import { GuildMember } from "discord.js";
import ArcoClient from "../Client";
import { ArcoGuild } from "./Guild";

export class ArcoGuildMember extends GuildMember {
    public level = 1;
    public xp = 0;
    constructor(client: ArcoClient, data: object, guild: ArcoGuild) {
        super(client, data, guild);
    }
}