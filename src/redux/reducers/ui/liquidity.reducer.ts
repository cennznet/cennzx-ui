import produce from 'immer';
import {handleActions} from 'redux-actions';
import {BaseError} from '../../../error/error';
import {IAssetBalance, IExchangePool, IFee, IUserShareInPool, LiquidityFormData} from '../../../typings';
import {Amount} from '../../../util/Amount';
import LiquidityActions, {
    RemoveLiquidityErrorAction,
    ResetLiquidityErrorAction,
    SetAsset1AmountAction,
    SetAsset2AmountAction,
    SetLiquidityAction,
    SetLiquidityErrorAction,
    UpdateAsset1AmountAction,
    UpdateAsset2AmountAction,
    UpdateExchangeRateAction,
    UpdateExtrinsicAction,
    UpdateFeeAssetAction,
    UpdateLiquidityForWithdrawalAction,
    UpdatePoolBalanceAction,
    UpdateSelectedAccountAction,
    UpdateSelectedAsset1Action,
    UpdateSelectedAsset2Action,
    UpdateTotalLiquidityAction,
    UpdateTransactionBufferAction,
    UpdateTransactionFeeAction,
    UpdateTxFeeParameterAction,
    UpdateUserAssetBalanceAction,
    UpdateUserPoolShareAction,
} from '../../actions/ui/liquidity.action';

export interface LiquidityState {
    exchangeRate?: Amount;
    exchangePool: IExchangePool[];
    userPoolShare?: IUserShareInPool[];
    totalLiquidity?: Amount;
    txFee?: IFee;
    form: Partial<LiquidityFormData>;
    userAssetBalance: IAssetBalance[];
    extrinsicParams?: any[];
    error: BaseError[];
    liquidityToWithdraw?: Amount;
}

export const initialState: LiquidityState = {
    form: {
        buffer: typeof window !== 'undefined' ? window.config.FEE_BUFFER : 0.05,
    },
    exchangePool: [],
    userAssetBalance: [],
    userPoolShare: [],
    error: [],
};

export default handleActions<LiquidityState, any>(
    {
        [LiquidityActions.LIQUIDITY_TO_WITHDRAW_UPDATE]: produce(
            (draft: LiquidityState, action: UpdateLiquidityForWithdrawalAction) => {
                draft.liquidityToWithdraw = action.payload;
            }
        ),
        [LiquidityActions.TOTAL_LIQUIDITY_UPDATE]: produce(
            (draft: LiquidityState, action: UpdateTotalLiquidityAction) => {
                draft.totalLiquidity = action.payload;
            }
        ),
        [LiquidityActions.LIQUIDITY_TYPE]: produce((draft: LiquidityState, action: SetLiquidityAction) => {
            draft.form.type = action.payload;
        }),
        [LiquidityActions.SELECTED_ACCOUNT_UPDATE]: produce(
            (draft: LiquidityState, action: UpdateSelectedAccountAction) => {
                draft.form.signingAccount = action.payload;
            }
        ),
        [LiquidityActions.LIQUIDITY_POOL_BALANCE_UPDATE]: produce(
            (draft: LiquidityState, action: UpdatePoolBalanceAction) => {
                const index = draft.exchangePool.findIndex(
                    (poolData: IExchangePool) => poolData.assetId === action.payload.assetId
                );
                if (index === -1) {
                    draft.exchangePool.push(action.payload);
                } else {
                    draft.exchangePool[index] = action.payload;
                }
            }
        ),
        [LiquidityActions.USER_POOL_SHARE_UPDATE]: produce(
            (draft: LiquidityState, action: UpdateUserPoolShareAction) => {
                const index = draft.exchangePool.findIndex(
                    (poolShareData: IUserShareInPool) =>
                        poolShareData.assetId === action.payload.assetId &&
                        poolShareData.address === action.payload.address
                );
                if (index === -1) {
                    draft.userPoolShare.push(action.payload);
                } else {
                    draft.userPoolShare[index] = action.payload;
                }
            }
        ),
        [LiquidityActions.USER_ASSET_BALANCE_UPDATE]: produce(
            (draft: LiquidityState, action: UpdateUserAssetBalanceAction) => {
                const index = draft.userAssetBalance.findIndex(
                    (userBal: IAssetBalance) =>
                        userBal.assetId === action.payload.assetId && userBal.account === action.payload.account
                );
                if (index === -1) {
                    draft.userAssetBalance.push(action.payload);
                } else {
                    draft.userAssetBalance[index] = action.payload;
                }
            }
        ),

        [LiquidityActions.SELECTED_ASSET1_UPDATE]: produce(
            (draft: LiquidityState, action: UpdateSelectedAsset1Action) => {
                draft.form.assetId = action.payload;
            }
        ),
        [LiquidityActions.ASSET1_AMOUNT_SET]: produce((draft: LiquidityState, action: UpdateAsset1AmountAction) => {
            draft.form.assetAmount = action.payload;
        }),
        [LiquidityActions.ASSET1_AMOUNT_UPDATE]: produce((draft: LiquidityState, action: SetAsset1AmountAction) => {
            draft.form.assetAmount = action.payload;
        }),
        [LiquidityActions.ASSET2_AMOUNT_SET]: produce((draft: LiquidityState, action: UpdateAsset2AmountAction) => {
            draft.form.coreAmount = action.payload;
        }),
        [LiquidityActions.ASSET2_AMOUNT_UPDATE]: produce((draft: LiquidityState, action: SetAsset2AmountAction) => {
            draft.form.coreAmount = action.payload;
        }),

        [LiquidityActions.ERROR_SET]: produce((draft: LiquidityState, action: SetLiquidityErrorAction) => {
            draft.error.push(action.payload);
        }),
        [LiquidityActions.ERROR_REMOVE]: produce((draft: LiquidityState, action: RemoveLiquidityErrorAction) => {
            const index = draft.error.findIndex((err: BaseError) => err.message === action.payload.message);
            if (index > -1) {
                draft.error.splice(index, 1);
            }
        }),
        [LiquidityActions.ERROR_RESET]: produce((draft: LiquidityState, action: ResetLiquidityErrorAction) => {
            draft.error = [];
        }),
        [LiquidityActions.FEE_ASSET_UPDATE]: produce((draft: LiquidityState, action: UpdateFeeAssetAction) => {
            draft.form.feeAssetId = action.payload;
        }),
        [LiquidityActions.EXTRINSIC_UPDATE]: produce((draft: LiquidityState, action: UpdateExtrinsicAction) => {
            draft.form.extrinsic = action.payload;
            draft.form.assetAmount = undefined;
            draft.form.assetId = undefined;
            draft.form.coreAmount = undefined;
        }),
        [LiquidityActions.TRANSACTION_BUFFER_UPDATE]: produce(
            (draft: LiquidityState, action: UpdateTransactionBufferAction) => {
                draft.form.buffer = action.payload;
            }
        ),
        [LiquidityActions.TRANSACTION_FEE_UPDATE]: produce(
            (draft: LiquidityState, action: UpdateTransactionFeeAction) => {
                draft.txFee = action.payload;
            }
        ),
        [LiquidityActions.TRANSACTION_FEE_PARAMS_UPDATE]: produce(
            (draft: LiquidityState, action: UpdateTxFeeParameterAction) => {
                draft.extrinsicParams = action.payload;
            }
        ),
        [LiquidityActions.EXCHANGE_RATE_UPDATE]: produce((draft: LiquidityState, action: UpdateExchangeRateAction) => {
            draft.exchangeRate = action.payload;
        }),
        [LiquidityActions.LIQUIDITY_RESET]: produce((draft: LiquidityState) => {
            draft.form.extrinsic = undefined;
            draft.form.assetAmount = undefined;
            draft.form.assetId = undefined;
            draft.form.coreAmount = undefined;
            draft.form.signingAccount = undefined;
            draft.form.buffer = 0.05;
            draft.extrinsicParams = undefined;
            draft.txFee = undefined;
            draft.error = [];
            draft.userAssetBalance = [];
            draft.userPoolShare = [];
        }),
        [LiquidityActions.SELECTED_ASSET2_UPDATE]: produce(
            (draft: LiquidityState, action: UpdateSelectedAsset2Action) => {
                draft.form.coreAssetId = action.payload;
            }
        ),
    },
    initialState
);
