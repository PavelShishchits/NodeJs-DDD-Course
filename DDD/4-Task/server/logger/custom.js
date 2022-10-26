'use strict';
const path = require('node:path');
const util = require('node:util');
const fs = require('node:fs');
const { promiseResponseToBool } = require('../utils/index');

const COLORS = {
    info: '\x1b[1;37m',
    debug: '\x1b[1;33m',
    error: '\x1b[0;31m',
    system: '\x1b[1;34m',
    access: '\x1b[1;38m',
};

class Logger {
    constructor(logPath) {
        this.path = logPath;
        this.init();
    }

    init() {
        const filePath = this.createFilePath();
        this.stream = fs.createWriteStream(filePath, { flags: 'a' });
        this.regexp = new RegExp(path.dirname(filePath), 'g');
    }

    createFilePath() {
        // const dirExist = await fs.promises.access(this.path).then(...promiseResponseToBool);
        // let dirPath = dirExist ? this.path : await fs.promises.mkdir(this.path, { recursive: true });
        let dirPath = this.path;
        const date = new Date().toISOString().substring(0, 10);
        return path.join(dirPath, `${date}.log`);
    }

    close() {
        return new Promise((resolve) => this.stream.end(resolve));
    }

    write(type = 'info', message) {
        const date = new Date().toISOString().substring(0, 19);
        const color = COLORS[type];
        const line = date + '\t' + message;
        console.log(color + line + '\x1b[0m');
        const out = line.replace(/[\n\r]\s*/g, '; ') + '\n';
        this.stream && this.stream.write(out);
    }

    log(...args) {
        const msg = util.format(...args);
        this.write('info', msg)
    }

    dir(...args) {
        const msg = util.inspect(...args);
        this.write('info', msg);
    }
    
    debug(...args) {
        const msg = util.format(...args);
        this.write('debug', msg);
    }
    
    error(...args) {
        const msg = util.format(...args).replace(/[\n\r]{2,}/g, '\n');
        this.write('error', msg.replace(this.regexp, ''));
    }

    system(...args) {
        const msg = util.format(...args);
        this.write('system', msg);
    }

    access(...args) {
        const msg = util.format(...args);
        this.write('access', msg);
    }
}

module.exports = ({ path }) => new Logger(path);