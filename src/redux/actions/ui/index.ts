import {ExchangeActions} from './exchange.action';
import {LiquidityActions} from './liquidity.action';
import {LiquidityPoolActions} from './liquidityPool.action';
import {SendActions} from './send.action';
import {TxDialogActions} from './txDialog.action';

export default {
    Exchange: ExchangeActions,
    Liquidity: LiquidityActions,
    Send: SendActions,
    TxDialog: TxDialogActions,
    LiquidityPool: LiquidityPoolActions,
};
