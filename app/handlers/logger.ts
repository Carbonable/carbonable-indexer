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

    memory() {
        const mega = 1_000_000;
        return Math.round(process.memoryUsage().rss / mega);
    },

    block(number: number) {
        log(blackBright(`[${logger.time()} > ${logger.memory()}Mo]`), bold(blackBright(`BLOCK #${number}`)));
    },

    project(message: string) {
        log(blackBright(`[${logger.time()} > ${logger.memory()}Mo]`), bold(yellow(`PROJECT EVENT`)), white(`> ${message}`));
    },

    minter(message: string) {
        log(blackBright(`[${logger.time()} > ${logger.memory()}Mo]`), bold(magenta(`MINTER EVENT`)), white(`> ${message}`));
    },

    vester(message: string) {
        log(blackBright(`[${logger.time()} > ${logger.memory()}Mo]`), bold(blue(`VESTER EVENT`)), white(`> ${message}`));
    },

    offseter(message: string) {
        log(blackBright(`[${logger.time()} > ${logger.memory()}Mo]`), bold(green(`OFFSETER EVENT`)), white(`> ${message}`));
    },

    yielder(message: string) {
        log(blackBright(`[${logger.time()} > ${logger.memory()}Mo]`), bold(cyan(`YIELDER EVENT`)), white(`> ${message}`));
    },

    request(message: string) {
        log(blackBright(`[${logger.time()} > ${logger.memory()}Mo]`), bold(red(`REQUEST`)), white(`> ${message}`));
    },

    error(message: string) {
        log(red(`[${logger.time()} > ${logger.memory()}Mo]`), bold(red(`ERROR`)), red(`> ${message}`));
    },
}

export default logger;