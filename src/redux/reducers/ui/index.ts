import {combineReducers} from 'redux';
import exchange from './exchange.reducer';
import liquidity from './liquidity.reducer';
import send from './send.reducer';
import txDialog from './txDialog.reducer';

export default combineReducers({
    exchange,
    liquidity,
    txDialog,
    send,
});
