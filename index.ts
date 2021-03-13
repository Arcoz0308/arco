import ArcoClient from "./base/Client";
import setting from "./settings";
import settings from './settings';
import defaultPage from './web/default/index';
const init = async () => {
    const client = new ArcoClient();
    await client.login(setting.TOKEN);
    new defaultPage(client);
}
init();