"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const debug = require('debug')('jest-mongodb:teardown');
module.exports = async function (config) {
    const globalConfigPath = (0, path_1.join)(config.rootDir, 'globalConfig.json');
    debug('Teardown mongod');
    if (global.__MONGOD__) {
        await global.__MONGOD__.stop();
    }
    (0, fs_1.unlink)(globalConfigPath, err => {
        if (err) {
            debug('Config could not be deleted');
            return;
        }
        debug('Config is deleted');
    });
};
