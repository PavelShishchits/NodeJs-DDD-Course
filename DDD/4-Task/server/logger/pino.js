'use strict';
const path = require('node:path');
const pino = require('pino');

class PinoLogger {
	constructor(logPath) {
		this.path = logPath;
		const date = new Date().toISOString().substring(0, 10);
		this.logger = pino(pino.destination(path.join(this.path, `${date}.log`)));
	}

	log(...args) {
		this.logger.info(args);
	}

	dir(...args) {
		this.log(args);
	}

	debug(...args) {
		this.logger.debug(args);
	}

	error(...args) {
		this.logger.error(args);
	}

	system(...args) {
		this.log(args);
	}

	access(...args) {
		this.log(args);
	}
}

module.exports = ({ path }) => new PinoLogger(path);