let ENDPOINT = '', ENV = '';
if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.endsWith('centrality.me')) {
        ENDPOINT = 'wss://nikau.centrality.me/public/ws';
        ENV = 'DEV';
    } else if (hostname.endsWith('centrality.com')) {
        ENDPOINT = 'wss://cennznet.unfrastructure.io/public/ws';
        ENV = 'PROD';
    } else {
        ENDPOINT = 'ws://127.0.0.1:9944/'
        ENV = 'local';
    }
    window.config = {
        ENDPOINT: ENDPOINT,
        ENV: ENV,
        FEE_BUFFER: 0.05,
        MAX_FEE_BUFFER: 0.5,
        MIN_FEE_BUFFER: 0.01
    }
}
