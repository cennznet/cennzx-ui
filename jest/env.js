const NodeEnvironment = require('jest-environment-node');

class Environment extends NodeEnvironment {
    constructor(config) {
        super(
            Object.assign({}, config, {
                globals: Object.assign({}, config.globals, {
                    Uint8Array: Uint8Array,
                    ArrayBuffer: ArrayBuffer,
                    window: {
                        config: {
                            ENDPOINT: 'ws://127.0.0.1:9944/'
                        }
                    }
                }),
            })
        );
    }
}

module.exports = Environment;
