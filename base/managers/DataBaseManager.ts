 import * as mysql from 'mysql';
 import { db } from '../../../../config.json';
 export default class DataBaseManager {
     public con = mysql.createConnection({
        host: db.host,
        user: db.user,
        password: db.mdp,
        database: db.db
    });
     constructor() {
        const con = this.con;
        this.con.connect(function (err: any) {
            if(err) {
                console.log(`Db guild failed to connect Ouput:${err.message}`);
                setTimeout(con.connect, 2000);
            }
        });
        this.con.on('error', (err: any) => {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.log('DB guild disconnected attempting reconnection');
                con.connect((err: any) => {
                    if (err) throw err;
                    console.log('DB guild reconnected!');
                });
            } else if(err.code === 'ECONNREFUSED') {
                con.connect((err: any) => {
                    if(err) throw err;
                    console.log('DB guild reconnected!');
                })
            } else {
                throw err;
            }
        });
        this.con.on('connect', () => {
            console.log(`guild db Connected!`);
        });
     }
     query(c: mysql.QueryOptions) {
        return this.con.query(c);
     }

 }