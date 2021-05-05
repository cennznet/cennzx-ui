import {connectRouter} from 'connected-react-router';
import {combineReducers} from 'redux';
import history from '../history';
import extension, {ExtensionState} from './extension.reducer';
import global, {GlobalState} from './global.reducer';
import localize from './localize.reducer';
import {ExchangeState} from './ui/exchange.reducer';
import ui from './ui/index';
import {LiquidityState} from './ui/liquidity.reducer';
import {TxDialogState} from './ui/txDialog.reducer';

let router = null;
if (typeof document !== 'undefined') {
    router = connectRouter(history);
}

export default combineReducers({
    router: router,
    localize: localize,
    extension: extension,
    global: global,
    ui,
});

export interface AppState {
    extension: ExtensionState;
    global: GlobalState;
    ui: {
        exchange: ExchangeState;
        liquidity: LiquidityState;
        txDialog: TxDialogState;
    };
}
