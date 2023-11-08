"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable multiline-ternary */
const fs_1 = require("fs");
const path_1 = require("path");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const helpers_1 = require("./helpers");
const debug = require('debug')('jest-mongodb:setup');
const mongoMemoryServerOptions = (0, helpers_1.getMongodbMemoryOptions)();
const isReplSet = Boolean(mongoMemoryServerOptions.replSet);
debug(`isReplSet ${isReplSet}`);
// @ts-ignore
const mongo = isReplSet
    ? new mongodb_memory_server_1.MongoMemoryReplSet(mongoMemoryServerOptions)
    : new mongodb_memory_server_1.MongoMemoryServer(mongoMemoryServerOptions);
module.exports = async (config) => {
    const globalConfigPath = (0, path_1.join)(config.rootDir, 'globalConfig.json');
    const options = (0, helpers_1.getMongodbMemoryOptions)();
    const mongoConfig = {};
    debug(`shouldUseSharedDBForAllJestWorkers: ${(0, helpers_1.shouldUseSharedDBForAllJestWorkers)()}`);
    // if we run one mongodb instance for all tests
    if ((0, helpers_1.shouldUseSharedDBForAllJestWorkers)()) {
        if (!mongo.isRunning) {
            await mongo.start();
        }
        const mongoURLEnvName = (0, helpers_1.getMongoURLEnvName)();
        mongoConfig.mongoUri = await mongo.getUri();
        process.env[mongoURLEnvName] = mongoConfig.mongoUri;
        // Set reference to mongod in order to close the server during teardown.
        global.__MONGOD__ = mongo;
    }
    mongoConfig.mongoDBName = options.instance.dbName;
    // Write global config to disk because all tests run in different contexts.
    (0, fs_1.writeFileSync)(globalConfigPath, JSON.stringify(mongoConfig));
    debug('Config is written');
};
