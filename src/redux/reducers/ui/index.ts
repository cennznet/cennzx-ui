import {combineReducers} from 'redux';
import exchange from './exchange.reducer';
import liquidity from './liquidity.reducer';
import txDialog from './txDialog.reducer';

export default combineReducers({
    exchange,
    liquidity,
    txDialog,
});
