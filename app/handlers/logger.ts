import { blackBright, yellow, magenta, blue, green, red, cyan, bold, white, magentaBright } from 'colorette';

const log = console.log;

const logger = {

    parse(date: Date) {
        return date.getFullYear() + "/" +
            ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
            ("00" + date.getDate()).slice(-2) + " " +
            ("00" + date.getHours()).slice(-2) + ":" +
            ("00" + date.getMinutes()).slice(-2) + ":" +
            ("00" + date.getSeconds()).slice(-2);
    },

    time() {
        const date = new Date();
        return logger.parse(date);
    },

    memory() {
        const mega = 1_000_000;
        return Math.round(process.memoryUsage().rss / mega);
    },

    block(number: number, time: Date) {
        const date = logger.parse(time);
        log(blackBright(`[${logger.time()} > ${logger.memory()}Mo]`), bold(blackBright(`BLOCK #${number}`)), white(`> ${date}`));
    },

    badge(message: string) {
        log(blackBright(`[${logger.time()} > ${logger.memory()}Mo]`), bold(magentaBright(`BADGE EVENT`)), white(`> ${message}`));
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