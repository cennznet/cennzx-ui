import produce from 'immer';
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import {BaseError} from '../../../error/error';
import {IAddLiquidity, IAssetBalance, IExchangePool, IFee, IRemoveLiquidity, ITxFeeParams} from '../../../typings';
import {Amount} from '../../../util/Amount';
import PoolActions, {
    ResetPoolAction,
    SetInvestmentAssetAmountAction,
    SetInvestmentCoreAmountAction,
    SetPoolErrorAction,
    UpdateAddLiquidityBufferAction,
    UpdateExchangeRateAction,
    UpdateExtrinsicAction,
    UpdateInvestmentAssetAction,
    UpdateInvestmentAssetAmountAction,
    UpdateInvestmentCoreAmountAction,
    UpdateInvestmentFeeAssetAction,
    UpdateInvestorForAddLiquidityAction,
    UpdateInvestorForRemoveLiquidityAction,
    UpdateInvestorFreeBalanceAction,
    UpdatePoolBalanceAction,
    UpdateRemoveLiquidityBufferAction,
    UpdateTransactionFeeAction,
    UpdateTxFeeParameterAction,
    UpdateUserLiquidityAction,
    UpdateUserPayAssetBalanceForAddLiquidityAction,
    UpdateUserPayAssetBalanceForWithdrawLiquidityAction,
    UpdateWithdrawalAssetAction,
    UpdateWithdrawalFeeAssetAction,
    UpdateWithdrawalLiquidityAction,
} from '../../actions/ui/liquidityPool.action';

export interface LiquidityPoolState {
    userLiquidity?: Amount;
    txFee?: IFee;
    addLiquidity?: IAddLiquidity;
    removeLiquidity?: IRemoveLiquidity;
    exchangePool?: IExchangePool;
    exchangeRate?: Amount;
    error?: BaseError;
    userAssetBalance: any[];
    extrinsic?: string;
    txFeeParams?: ITxFeeParams;
}

export const initialState: LiquidityPoolState = {
    userAssetBalance: [],
};

const coreLiquidity = handleActions<LiquidityPoolState, any>(
    {
        [PoolActions.USER_LIQUIDITY_UPDATE]: produce((draft: LiquidityPoolState, action: UpdateUserLiquidityAction) => {
            draft.userLiquidity = action.payload;
        }),
        [PoolActions.TRANSACTION_FEE_UPDATE]: produce(
            (draft: LiquidityPoolState, action: UpdateTransactionFeeAction) => {
                draft.txFee = action.payload;
            }
        ),
        [PoolActions.EXCHANGE_RATE_UPDATE]: produce((draft: LiquidityPoolState, action: UpdateExchangeRateAction) => {
            draft.exchangeRate = action.payload;
        }),
        [PoolActions.POOL_RESET]: produce((draft: LiquidityPoolState, action: ResetPoolAction) => {
            return initialState;
        }),
        [PoolActions.EXTRINSIC_UPDATE]: produce((draft: LiquidityPoolState, action: UpdateExtrinsicAction) => {
            draft.extrinsic = action.payload;
        }),
        [PoolActions.EXCHANGE_POOL_BALANCE_UPDATE]: produce(
            (draft: LiquidityPoolState, action: UpdatePoolBalanceAction) => {
                draft.exchangePool = action.payload;
            }
        ),
        [PoolActions.TRANSACTION_FEE_PARAMS_UPDATE]: produce(
            (draft: LiquidityPoolState, action: UpdateTxFeeParameterAction) => {
                draft.txFeeParams = action.payload;
            }
        ),
        [PoolActions.ERROR_SET]: produce((draft: any, action: SetPoolErrorAction) => {
            draft.error = action.payload;
        }),
    },
    initialState
);

const addLiquidity = handleActions<LiquidityPoolState, any>(
    {
        [PoolActions.ADD_LIQUIDITY_INVESTOR_UPDATE]: produce(
            (draft: LiquidityPoolState, action: UpdateInvestorForAddLiquidityAction) => {
                draft.addLiquidity.form.investor = action.payload;
            }
        ),
        [PoolActions.DEPOSIT_ASSET_UPDATE]: produce(
            (draft: LiquidityPoolState, action: UpdateInvestmentAssetAction) => {
                draft.addLiquidity.form.asset = action.payload;
            }
        ),
        [PoolActions.DEPOSIT_ASSET_AMOUNT_SET]: produce(
            (draft: LiquidityPoolState, action: SetInvestmentAssetAmountAction) => {
                draft.addLiquidity.form.assetAmount = action.payload;
            }
        ),
        [PoolActions.DEPOSIT_CORE_AMOUNT_SET]: produce(
            (draft: LiquidityPoolState, action: SetInvestmentCoreAmountAction) => {
                draft.addLiquidity.form.coreAmount = action.payload;
            }
        ),
        [PoolActions.DEPOSIT_ASSET_AMOUNT_UPDATE]: produce(
            (draft: LiquidityPoolState, action: UpdateInvestmentAssetAmountAction) => {
                draft.addLiquidity.form.assetAmount = action.payload;
            }
        ),
        [PoolActions.DEPOSIT_CORE_AMOUNT_UPDATE]: produce(
            (draft: LiquidityPoolState, action: UpdateInvestmentCoreAmountAction) => {
                draft.addLiquidity.form.coreAmount = action.payload;
            }
        ),
        [PoolActions.ADD_LIQUIDITY_BUFFER_UPDATE]: produce(
            (draft: LiquidityPoolState, action: UpdateAddLiquidityBufferAction) => {
                draft.addLiquidity.form.buffer = action.payload;
            }
        ),
        [PoolActions.ADD_LIQUIDITY_FEE_ASSET_UPDATE]: produce(
            (draft: LiquidityPoolState, action: UpdateInvestmentFeeAssetAction) => {
                draft.addLiquidity.form.feeAssetId = action.payload;
            }
        ),
        [PoolActions.INVESTOR_FREE_BALANCE_UPDATE]: produce(
            (draft: LiquidityPoolState, action: UpdateInvestorFreeBalanceAction) => {
                draft.addLiquidity.investorBalance = action.payload;
            }
        ),
        [PoolActions.USER_ASSET_BALANCE_FOR_ADD_LIQUIDITY_UPDATE]: produce(
            (draft: LiquidityPoolState, action: UpdateUserPayAssetBalanceForAddLiquidityAction) => {
                const index = draft.userAssetBalance.findIndex(
                    (assetData: IAssetBalance) =>
                        assetData.assetId === draft.addLiquidity.form.feeAssetId &&
                        assetData.account === draft.addLiquidity.form.investor
                );
                if (index === -1) {
                    draft.userAssetBalance.push(action.payload);
                } else {
                    draft.userAssetBalance[index] = action.payload;
                }
            }
        ),
    },
    initialState
);

const removeLiquidity = handleActions<LiquidityPoolState, any>(
    {
        [PoolActions.REMOVE_LIQUIDITY_INVESTOR_UPDATE]: produce(
            (draft: LiquidityPoolState, action: UpdateInvestorForRemoveLiquidityAction) => {
                draft.removeLiquidity.form.investor = action.payload;
            }
        ),
        [PoolActions.WITHDRAW_ASSET_UPDATE]: produce(
            (draft: LiquidityPoolState, action: UpdateWithdrawalAssetAction) => {
                draft.removeLiquidity.form.asset = action.payload;
            }
        ),
        [PoolActions.WITHDRAW_LIQUIDITY_UPDATE]: produce(
            (draft: LiquidityPoolState, action: UpdateWithdrawalLiquidityAction) => {
                draft.removeLiquidity.form.liquidity = action.payload;
            }
        ),
        [PoolActions.REMOVE_LIQUIDITY_BUFFER_UPDATE]: produce(
            (draft: LiquidityPoolState, action: UpdateRemoveLiquidityBufferAction) => {
                draft.removeLiquidity.form.buffer = action.payload;
            }
        ),
        [PoolActions.REMOVE_LIQUIDITY_FEE_ASSET_UPDATE]: produce(
            (draft: LiquidityPoolState, action: UpdateWithdrawalFeeAssetAction) => {
                draft.removeLiquidity.form.feeAssetId = action.payload;
            }
        ),
        [PoolActions.USER_ASSET_BALANCE_FOR_REMOVE_LIQUIDITY_UPDATE]: produce(
            (draft: LiquidityPoolState, action: UpdateUserPayAssetBalanceForWithdrawLiquidityAction) => {
                const index = draft.userAssetBalance.findIndex(
                    (assetData: IAssetBalance) =>
                        assetData.assetId === draft.removeLiquidity.form.feeAssetId &&
                        assetData.account === draft.removeLiquidity.form.investor
                );
                if (index === -1) {
                    draft.userAssetBalance.push(action.payload);
                } else {
                    draft.userAssetBalance[index] = action.payload;
                }
            }
        ),
    },
    initialState
);

export default combineReducers({
    addLiquidity,
    removeLiquidity,
    coreLiquidity,
});
