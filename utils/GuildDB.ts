 interface GuildDB{
    prefix: string;
    lang: string;
    level: {
        enable?: boolean;
        levelUpMessage?: string;
        levelUpChannel?: string;
        hard?: number;
        delBeforeRoleReward?: boolean;
        rewars?: {
            int: string;
        }
    
    }

 }