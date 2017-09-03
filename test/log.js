const log = require('../index');

describe('logger tests', function () {
  it('display log message in console colored', () =>{
    const logger = new log.ConsoleLogger(log.levels.debug);
    logger.warn('oops %d', 12);
    logger.error('oops %d', 12);
    logger.info('oops %d', 12);
    logger.debug('oops %d', 12);
  });

  it('does not display log message', () =>{
    const logger = new log.WinstonLogger(log.levels.debug);
    logger.debug('oops');
  });  
});
