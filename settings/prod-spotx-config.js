if (window !== 'undefined') {
    window.config = {
        ENDPOINT: 'wss://cennznet.unfrastructure.io/public/ws',
        ENV: 'PROD',
        ASSETS: [{symbol: 'CENNZ', id: 1}, {symbol: 'CPAY', id: 2},/* {symbol: 'TOKEN', id: 17233}, {symbol: 'TOKEN1', id: 17237} */],
        FEE_BUFFER: 0.05
    }
}