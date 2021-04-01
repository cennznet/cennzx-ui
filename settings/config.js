if (typeof window !== 'undefined') {
    window.config = {
        ENDPOINT: 'ws://127.0.0.1:9944/',
        // ENDPOINT: 'wss://nikau.centrality.me/public/ws',
        ENV: 'local',
        // ASSETS: [{symbol: 'CENNZ', id: 16000}, {symbol: 'CPAY', id: 16001}, {symbol: 'PLUG', id: 16003},/* {symbol: 'TOKEN', id: 17233}, {symbol: 'TOKEN1', id: 17237} */],
        FEE_BUFFER: 0.05,
        MAX_FEE_BUFFER: 0.5,
        MIN_FEE_BUFFER: 0.01
    }
}
