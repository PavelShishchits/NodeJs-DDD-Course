'use strict';
const fs = require('node:fs').promises;
const vm = require('node:vm');

const RUN_OPTIONS = { timeout: 5000, displayErrors: true };

const customRequire = async (filePath, sandBox = {}) => {
    const fileSrc = await fs.readFile(filePath);
    const code = `(require, module, __filename, __dirname) => {\n${fileSrc}\n}`;
    const script = new vm.Script(code);
    const scriptContext = vm.createContext(Object.freeze({...sandBox}));
    const scriptWrapper = script.runInContext(scriptContext, RUN_OPTIONS);
    const module = {}
    scriptWrapper(customRequire, module, filePath, __dirname);
    
    return module.exports;
}

module.exports = customRequire;