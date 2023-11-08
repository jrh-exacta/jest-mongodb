"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const jest_environment_node_1 = require("jest-environment-node");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const helpers_1 = require("./helpers");
// eslint-disable-next-line import/order
const debug = require('debug')('jest-mongodb:environment');
const options = (0, helpers_1.getMongodbMemoryOptions)();
const isReplSet = Boolean(options.replSet);
debug(`isReplSet`, isReplSet);
const mongo = isReplSet ? new mongodb_memory_server_1.MongoMemoryReplSet(options) : new mongodb_memory_server_1.MongoMemoryServer(options);
module.exports = class MongoEnvironment extends jest_environment_node_1.TestEnvironment {
    globalConfigPath;
    constructor(config, context) {
        super(config, context);
        this.globalConfigPath = (0, path_1.join)(config.globalConfig.rootDir, 'globalConfig.json');
    }
    async setup() {
        debug('Setup MongoDB Test Environment');
        const globalConfig = JSON.parse((0, fs_1.readFileSync)(this.globalConfigPath, 'utf-8'));
        if (globalConfig.mongoUri) {
            this.global.__MONGO_URI__ = globalConfig.mongoUri;
        }
        else {
            await mongo.start();
            this.global.__MONGO_URI__ = mongo.getUri();
        }
        this.global.__MONGO_DB_NAME__ = globalConfig.mongoDBName || (0, crypto_1.randomUUID)();
        await super.setup();
    }
    async teardown() {
        debug('Teardown MongoDB Test Environment');
        await mongo.stop();
        await super.teardown();
    }
    // @ts-ignore
    runScript(script) {
        // @ts-ignore
        return super.runScript(script);
    }
};
