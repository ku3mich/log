const winston = require('winston');
const moment =  require('moment');
const colors = require('colors/safe');

const levels = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  verbose: 'verbose',
  debug: 'debug',
};

const coloredLevels = {
  [levels.error] : s => colors.red(s),
  [levels.warn] : s => colors.yellow(s),
  [levels.info] : s => colors.cyan(s),
  [levels.verbose] : s => s,
  [levels.debug] : s => s
};

class Logger {
  constructor(level){
    if (this.constructor === Logger)
      throw new TypeError('Abstract');

    this.level = level;
    
    for (let l of Object.keys(levels)){
      this[l] = (_l => (...args) => {
        this.log(_l, args);
      })(l);
    }
  }

  log(level, ...args){  // eslint-disable-line no-unused-vars
    throw new TypeError('Abstract');
  }
}

class WinstonLogger extends Logger {
  constructor(level){
    super(level);
    this._logger = new winston.Logger({
      exitOnError: false
    });
  }

  log(level, args) {
    return this._logger[level].apply(this._logger, args);
  }
}

class ConsoleLogger extends WinstonLogger{


  constructor (level){
    super(level);

    this._logger.add(
      winston.transports.Console,
      {
        level: this.level,
        timestamp: function() {
          return moment().format('YYYY-MM-DD HH:mm:ss');
        },

        formatter: function(options) {
          return `${options.timestamp()} ${ConsoleLogger._formattedLevel(options.level)} ${options.message ? options.message : JSON.stringify(options.meta)}`;
        }
      });
  }

  static _formattedLevel(l){
    return coloredLevels[l](l.toUpperCase().padEnd(7));
  }
}

module.exports = {
  levels,
  Logger,
  WinstonLogger,
  ConsoleLogger
};
