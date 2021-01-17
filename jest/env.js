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
                            ENDPOINT: 'wss://rimu.unfrastructure.io/public/ws'
                        }
                    }
                }),
            })
        );
    }
}

module.exports = Environment;
