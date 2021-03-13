export class langManager {
    /**
    /**
     * 
     * @param {string} lang 
     * @param {string} key 
     * @param {object} [options={}]
     * @returns {string} 
     */
    
    static getText(lang: string, key: string, options = {}) {
        try { 
            let path = key.split(':')[0];
            let ke = key.split(':')[1];
            const json = require(`../${lang}/${path}.json`);
            let text = json[key];
            if(!options || options !== {}) {
                for (const [key, value] of Object().entries(options)) {
                    text = text.replace(`{${key}}`, value);
                }
                return text;
            } else {
                return text;
            }
        } catch (error) {
            console.error(error);
        }

    }

}