import ArcoClient from "../../base/Client";
import * as express from 'express';

export default class defaultPage {
    private client: ArcoClient;
    constructor(client: ArcoClient) {
        this.client = client;
        this.setUp();

    }
    async setUp(): Promise<void> {
        const app = express();
        app.get('/',(req,res) => {
            res.send('Hello world');
        });
        app.get('/*')
        app.listen(3889, () => {
            console.log('web page are listen on port 3889');
        });
    }
}