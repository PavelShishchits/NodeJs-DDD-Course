'use strict';

const path = require('node:path');
const util = require('node:util');
const fs = require('node:fs');

const COLORS = {
    info: '\x1b[1;37m',
    debug: '\x1b[1;33m',
    error: '\x1b[0;31m',
    system: '\x1b[1;34m',
    access: '\x1b[1;38m',
};

class Logger {
    constructor(logPath) {
        // toDo if folder isn't exist -> create it
        this.path = logPath;
        const date = new Date().toISOString().substring(0, 10);
        const filePath = path.join(this.path, `${date}.log`);
        this.stream = fs.createWriteStream(filePath, { flags: 'a' });
        this.regexp = new RegExp(path.dirname(this.path), 'g');
    }

    close() {
        return new Promise((resolve) => this.stream.end(resolve));
    }

    write(type = 'info', message) {
        const date = new Date().toISOString().substring(0, 19);
        const color = COLORS[type];
        const line = date + '\t' + message;
        const out = line.replace(/[\n\r]\s*/g, '; ') + '\n';
        this.stream.write(out);
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

// toDo get logger path from config
module.exports = new Logger('./log');