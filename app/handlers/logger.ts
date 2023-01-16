import { blackBright, yellow, magenta, blue, green, red, cyan, bold, white } from 'colorette';

const log = console.log;

const logger = {

    time() {
        const date = new Date();
        return date.getFullYear() + "/" +
            ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
            ("00" + date.getDate()).slice(-2) + " " +
            ("00" + date.getHours()).slice(-2) + ":" +
            ("00" + date.getMinutes()).slice(-2) + ":" +
            ("00" + date.getSeconds()).slice(-2);
    },

    block(number: number) {
        log(blackBright(`[${logger.time()}]`), bold(blackBright(`BLOCK #${number}`)));
    },

    project(message: string) {
        log(blackBright(`[${logger.time()}]`), bold(yellow(`PROJECT EVENT`)), white(`> ${message}`));
    },

    minter(message: string) {
        log(blackBright(`[${logger.time()}]`), bold(magenta(`MINTER EVENT`)), white(`> ${message}`));
    },

    vester(message: string) {
        log(blackBright(`[${logger.time()}]`), bold(blue(`VESTER EVENT`)), white(`> ${message}`));
    },

    offseter(message: string) {
        log(blackBright(`[${logger.time()}]`), bold(green(`OFFSETER EVENT`)), white(`> ${message}`));
    },

    yielder(message: string) {
        log(blackBright(`[${logger.time()}]`), bold(cyan(`YIELDER EVENT`)), white(`> ${message}`));
    },

    request(message: string) {
        log(blackBright(`[${logger.time()}]`), bold(red(`REQUEST`)), white(`> ${message}`));
    },

    error(message: string) {
        log(red(`[${logger.time()}]`), bold(red(`ERROR`)), red(`> ${message}`));
    },
}

export default logger;