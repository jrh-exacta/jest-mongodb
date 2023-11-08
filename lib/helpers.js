"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldUseSharedDBForAllJestWorkers = exports.getMongoURLEnvName = exports.getMongodbMemoryOptions = void 0;
const path_1 = require("path");
const cwd = process.cwd();
const configFile = process.env.MONGO_MEMORY_SERVER_FILE || 'jest-mongodb-config.js';
function getMongodbMemoryOptions() {
    try {
        const { mongodbMemoryServerOptions } = require((0, path_1.resolve)(cwd, configFile));
        return mongodbMemoryServerOptions;
    }
    catch (e) {
        return {
            binary: {
                skipMD5: true,
            },
            autoStart: false,
            instance: {},
        };
    }
}
exports.getMongodbMemoryOptions = getMongodbMemoryOptions;
function getMongoURLEnvName() {
    try {
        const { mongoURLEnvName } = require((0, path_1.resolve)(cwd, configFile));
        return mongoURLEnvName || 'MONGO_URL';
    }
    catch (e) {
        return 'MONGO_URL';
    }
}
exports.getMongoURLEnvName = getMongoURLEnvName;
function shouldUseSharedDBForAllJestWorkers() {
    try {
        const { useSharedDBForAllJestWorkers } = require((0, path_1.resolve)(cwd, configFile));
        if (typeof useSharedDBForAllJestWorkers === 'undefined') {
            return true;
        }
        return useSharedDBForAllJestWorkers;
    }
    catch (e) {
        return true;
    }
}
exports.shouldUseSharedDBForAllJestWorkers = shouldUseSharedDBForAllJestWorkers;
