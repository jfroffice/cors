const winston = require('winston');
require('winston-daily-rotate-file');

const { combine, timestamp, align, colorize, printf } = winston.format;

// meta param is ensured by splat()
const myFormat = printf(({ timestamp, level, message, meta }) => {
    const ts = timestamp.slice(0, 19).replace('T', ' ');
    let tmp = `${ts} [${level}] ${message}`;
    if (meta) {
        tmp += `
            ${JSON.stringify(meta, null, 2)}`;
    }
    return tmp;
});

let init;
let logger;
exports.get = function () {
    if (init) {
        return logger;
    }
    var transportFile = new winston.transports.DailyRotateFile({
        filename: 'logs/ppa-db-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        handleExceptions: true,
        json: false,
        maxSize: '5m',
        maxFiles: '30',
        colorize: false,
    });

    var transportConsole = new winston.transports.Console({
        json: false,
        handleExceptions: true,
        colorize: true,
    });

    logger = winston.createLogger({
        format: combine(colorize(), timestamp(), align(), myFormat),
        transports: [transportFile, transportConsole],
    });

    logger.stream = {
        write: function (msg) {
            logger.info(msg);
        },
    };

    if (process.env.NODE_ENV !== 'development') {
        console.log = (...args) => logger.info.call(logger, ...args);
        console.warn = (...args) => logger.warn.call(logger, ...args);
    }

    init = true;
    return logger;
};
