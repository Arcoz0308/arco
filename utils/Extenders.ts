String.prototype.replaces = function(search: Array<string|RegExp>, replace: string[]): string {
    let text: string = this.toString();
    if(search.length !== replace.length) throw new Error('Array of replace must by save size that search');
    for(let i = 0; i < search.length; i++) {
        let words = this.split(search[i]);
        if(words.length > 1) {
            for (let i2 = 0; i2 < words.length; i2++) {
                text = this.replace(search[i], replace[i]);
            }
        }
    }
    return text;
}