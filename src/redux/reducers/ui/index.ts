import {combineReducers} from 'redux';
import exchange from './exchange.reducer';
import send from './send.reducer';
import liquidity from './liquidity.reducer';
import liquidityPool from './liquidityPool.reducer';
import txDialog from './txDialog.reducer';

export default combineReducers({
    exchange,
    liquidity,
    txDialog,
    send,
    liquidityPool,
});
