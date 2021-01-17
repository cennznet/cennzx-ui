import produce from 'immer';
import {handleActions} from 'redux-actions';
import {BaseError} from '../../../error/error';
import {LiquidityFormData, IAssetBalance, IExchangePool, IFee} from '../../../typings';
import {Amount} from '../../../util/Amount';
import LiquidityActions, {
    SetAdd1Action,
    SetAdd2Action,
    UpdateExtrinsicAction,
    UpdateSelectedAccountAction,
    SetToAssetAmountAction,
    UpdateSelectedAdd1AssetAction,
    UpdateSelectedAdd2AssetAction,
    UpdateAdd1AssetAmountAction,
    UpdateAdd2AssetAmountAction,
    SetAdd1AssetAmountAction,
    SetAdd2AssetAmountAction,
    UpdatePoolBalanceAction,
    SetLiquidityAction,
    RemoveLiquidityErrorAction,
    ResetLiquidityErrorAction,
    SetLiquidityErrorAction,
    SetFromAssetAmountAction,
    UpdateFeeAssetAction,
    UpdateSelectedFromAssetAction,
    UpdateTransactionBufferAction,
    UpdateTransactionFeeAction,
    UpdateTxFeeParameterAction,
    UpdateExchangeRateAction,
    UpdateUserAssetBalanceAction,
} from '../../actions/ui/liquidity.action';

export interface LiquidityState {
    exchangeRate?: Amount;
    exchangePool: IExchangePool[];
    txFee?: IFee;
    form: Partial<LiquidityFormData>;
    userAssetBalance: IAssetBalance[];
    extrinsicParams?: any[];
    error: BaseError[];
}

export const initialState: LiquidityState = {
    form: {
        feeAssetId: 16001,
        buffer: typeof window !== 'undefined' ? window.config.FEE_BUFFER : 0.05,
    },
    exchangePool: [],
    userAssetBalance: [],
    error: [],
};

export default handleActions<LiquidityState, any>(
    {
        [LiquidityActions.LIQUIDITY_TYPE]: produce((draft: LiquidityState, action: SetLiquidityAction) => {
            draft.form.type = action.payload;
        }),
        [LiquidityActions.SELECTED_ACCOUNT_UPDATE]: produce(
            (draft: LiquidityState, action: UpdateSelectedAccountAction) => {
                draft.form.signingAccount = action.payload;
            }
        ),
        [LiquidityActions.TO_ASSET_AMOUNT_SET]: produce((draft: LiquidityState, action: SetToAssetAmountAction) => {
            draft.form.toAssetAmount = action.payload;
        }),
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
        [LiquidityActions.FROM_ASSET_AMOUNT_SET]: produce((draft: LiquidityState, action: SetFromAssetAmountAction) => {
            draft.form.fromAssetAmount = action.payload;
        }),
        [LiquidityActions.USER_ASSET_BALANCE_UPDATE]: produce(
            (draft: LiquidityState, action: UpdateUserAssetBalanceAction) => {
                const index = draft.userAssetBalance.findIndex(
                    (assetData: IAssetBalance) =>
                        assetData.assetId === draft.form.feeAssetId && assetData.account === draft.form.signingAccount
                );
                if (index === -1) {
                    draft.userAssetBalance.push(action.payload);
                }
                draft.userAssetBalance[index] = action.payload;
            }
        ),
        [LiquidityActions.USER_ADD1_ASSET_BALANCE_UPDATE]: produce(
            (draft: LiquidityState, action: UpdateUserAssetBalanceAction) => {
                const index = draft.userAssetBalance.findIndex((assetData: IAssetBalance) => {
                    return (
                        assetData.assetId === draft.form.add1Asset && assetData.account === draft.form.signingAccount
                    );
                });
                if (index === -1) {
                    draft.userAssetBalance.push(action.payload);
                }
                draft.userAssetBalance[index] = action.payload;
            }
        ),
        [LiquidityActions.ADD1_ASSET_AMOUNT_SET]: produce(
            (draft: LiquidityState, action: UpdateAdd1AssetAmountAction) => {
                draft.form.add1Amount = action.payload;
            }
        ),
        [LiquidityActions.ADD2_ASSET_AMOUNT_SET]: produce(
            (draft: LiquidityState, action: UpdateAdd2AssetAmountAction) => {
                draft.form.add2Amount = action.payload;
            }
        ),
        [LiquidityActions.ADD1_ASSET_AMOUNT_UPDATE]: produce(
            (draft: LiquidityState, action: SetAdd1AssetAmountAction) => {
                draft.form.add1Amount = action.payload;
            }
        ),
        [LiquidityActions.ADD2_ASSET_AMOUNT_UPDATE]: produce(
            (draft: LiquidityState, action: SetAdd2AssetAmountAction) => {
                draft.form.add2Amount = action.payload;
            }
        ),
        [LiquidityActions.SELECTED_ADD1_ASSET_UPDATE]: produce(
            (draft: LiquidityState, action: UpdateSelectedAdd1AssetAction) => {
                draft.form.add1Asset = action.payload;
            }
        ),
        [LiquidityActions.SELECTED_ADD2_ASSET_UPDATE]: produce(
            (draft: LiquidityState, action: UpdateSelectedAdd2AssetAction) => {
                draft.form.add2Asset = action.payload;
            }
        ),
        [LiquidityActions.TO_ASSET_AMOUNT_SET]: produce((draft: LiquidityState, action: SetToAssetAmountAction) => {
            draft.form.add1Amount = action.payload;
        }),

        [LiquidityActions.ERROR_SET]: produce((draft: LiquidityState, action: SetLiquidityErrorAction) => {
            draft.error.push(action.payload);
        }),
        [LiquidityActions.ERROR_REMOVE]: produce((draft: LiquidityState, action: RemoveLiquidityErrorAction) => {
            const newErrorList = draft.error.filter(err => err !== action.payload);
            draft.error = newErrorList;
        }),
        [LiquidityActions.ERROR_RESET]: produce((draft: LiquidityState, action: ResetLiquidityErrorAction) => {
            draft.error = [];
        }),
        [LiquidityActions.FEE_ASSET_UPDATE]: produce((draft: LiquidityState, action: UpdateFeeAssetAction) => {
            draft.form.feeAssetId = action.payload;
        }),

        [LiquidityActions.SELECTED_FROM_ASSET_UPDATE]: produce(
            (draft: LiquidityState, action: UpdateSelectedFromAssetAction) => {
                draft.form.fromAsset = action.payload;
            }
        ),

        [LiquidityActions.EXTRINSIC_UPDATE]: produce((draft: LiquidityState, action: UpdateExtrinsicAction) => {
            draft.form.extrinsic = action.payload;
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
    },
    initialState
);
