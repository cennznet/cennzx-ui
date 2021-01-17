if (window !== 'undefined') {
    window.config = {
        // ENDPOINT: 'wss://rimu.unfrastructure.io/public/ws',
        ENDPOINT: 'wss://cennznet.unfrastructure.io/public/ws',
        ENV: 'PROD',
        ASSETS: [{symbol: 'CENNZ', id: 16000}, {symbol: 'CPAY', id: 16001}, {symbol: 'PLUG', id: 16003},/* {symbol: 'TOKEN', id: 17233}, {symbol: 'TOKEN1', id: 17237} */],
        FEE_BUFFER: 0.05
    }
}