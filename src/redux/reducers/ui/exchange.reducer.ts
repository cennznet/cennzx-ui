import produce from 'immer';
import {handleActions} from 'redux-actions';
import {BaseError} from '../../../error/error';
import {ExchangeFormData, IAssetBalance, IExchangePool, IFee} from '../../../typings';
import {Amount} from '../../../util/Amount';
import ExchangeActions, {
    RemoveExchangeErrorAction,
    ResetExchangeErrorAction,
    SetExchangeErrorAction,
    SetFromAssetAmountAction,
    SetToAssetAmountAction,
    UpdateExchangeRateAction,
    UpdateExtrinsicAction,
    UpdateFeeAssetAction,
    UpdateFromAssetAmountAction,
    UpdatePoolBalanceAction,
    UpdateSelectedAccountAction,
    UpdateSelectedFromAssetAction,
    UpdateSelectedToAssetAction,
    UpdateToAssetAmountAction,
    UpdateTransactionBufferAction,
    UpdateTransactionFeeAction,
    UpdateTxFeeParameterAction,
    UpdateUserAssetBalanceAction,
} from '../../actions/ui/exchange.action';

export interface ExchangeState {
    exchangeRate?: Amount;
    exchangePool: IExchangePool[];
    txFee?: IFee;
    form: Partial<ExchangeFormData>;
    userAssetBalance: IAssetBalance[];
    extrinsicParams?: any[];
    error: BaseError[];
}

export const initialState: ExchangeState = {
    form: {feeAssetId: 16001, buffer: typeof window !== 'undefined' ? window.config.FEE_BUFFER : 0.05},
    exchangePool: [],
    userAssetBalance: [],
    error: [],
};

export default handleActions<ExchangeState, any>(
    {
        [ExchangeActions.SELECTED_ACCOUNT_UPDATE]: produce(
            (draft: ExchangeState, action: UpdateSelectedAccountAction) => {
                draft.form.signingAccount = action.payload;
            }
        ),
        [ExchangeActions.SELECTED_FROM_ASSET_UPDATE]: produce(
            (draft: ExchangeState, action: UpdateSelectedFromAssetAction) => {
                draft.form.fromAsset = action.payload;
            }
        ),
        [ExchangeActions.SELECTED_TO_ASSET_UPDATE]: produce(
            (draft: ExchangeState, action: UpdateSelectedToAssetAction) => {
                draft.form.toAsset = action.payload;
            }
        ),
        [ExchangeActions.FROM_ASSET_AMOUNT_SET]: produce((draft: ExchangeState, action: SetFromAssetAmountAction) => {
            draft.form.fromAssetAmount = action.payload;
        }),
        [ExchangeActions.TO_ASSET_AMOUNT_SET]: produce((draft: ExchangeState, action: SetToAssetAmountAction) => {
            draft.form.toAssetAmount = action.payload;
        }),
        [ExchangeActions.FROM_ASSET_AMOUNT_UPDATE]: produce(
            (draft: ExchangeState, action: UpdateFromAssetAmountAction) => {
                draft.form.fromAssetAmount = action.payload;
            }
        ),
        [ExchangeActions.TO_ASSET_AMOUNT_UPDATE]: produce((draft: ExchangeState, action: UpdateToAssetAmountAction) => {
            draft.form.toAssetAmount = action.payload;
        }),
        [ExchangeActions.TRANSACTION_FEE_UPDATE]: produce(
            (draft: ExchangeState, action: UpdateTransactionFeeAction) => {
                draft.txFee = action.payload;
            }
        ),
        [ExchangeActions.EXCHANGE_RATE_UPDATE]: produce((draft: ExchangeState, action: UpdateExchangeRateAction) => {
            draft.exchangeRate = action.payload;
        }),
        [ExchangeActions.TRADE_RESET]: () => initialState,
        [ExchangeActions.ASSET_SWAP]: produce((draft: ExchangeState) => {
            const draftFromAsset = draft.form.fromAsset;
            draft.form.fromAsset = draft.form.toAsset;
            draft.form.toAsset = draftFromAsset;
            if (draft.form.extrinsic === 'buyAsset') {
                draft.form.fromAssetAmount = draft.form.toAssetAmount;
                draft.form.toAssetAmount = undefined;
                draft.form.extrinsic = 'sellAsset';
            } else {
                draft.form.toAssetAmount = draft.form.fromAssetAmount;
                draft.form.fromAssetAmount = undefined;
                draft.form.extrinsic = 'buyAsset';
            }
        }),
        [ExchangeActions.EXTRINSIC_UPDATE]: produce((draft: ExchangeState, action: UpdateExtrinsicAction) => {
            draft.form.extrinsic = action.payload;
        }),
        [ExchangeActions.EXCHANGE_POOL_BALANCE_UPDATE]: produce(
            (draft: ExchangeState, action: UpdatePoolBalanceAction) => {
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
        [ExchangeActions.USER_ASSET_BALANCE_UPDATE]: produce(
            (draft: ExchangeState, action: UpdateUserAssetBalanceAction) => {
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
        [ExchangeActions.TRANSACTION_FEE_PARAMS_UPDATE]: produce(
            (draft: ExchangeState, action: UpdateTxFeeParameterAction) => {
                draft.extrinsicParams = action.payload;
            }
        ),
        [ExchangeActions.FEE_ASSET_UPDATE]: produce((draft: ExchangeState, action: UpdateFeeAssetAction) => {
            draft.form.feeAssetId = action.payload;
        }),
        [ExchangeActions.ERROR_SET]: produce((draft: ExchangeState, action: SetExchangeErrorAction) => {
            draft.error.push(action.payload);
        }),
        [ExchangeActions.ERROR_REMOVE]: produce((draft: ExchangeState, action: RemoveExchangeErrorAction) => {
            const newErrorList = draft.error.filter(err => err !== action.payload);
            draft.error = newErrorList;
        }),
        [ExchangeActions.ERROR_RESET]: produce((draft: ExchangeState, action: ResetExchangeErrorAction) => {
            draft.error = [];
        }),
        [ExchangeActions.TRANSACTION_BUFFER_UPDATE]: produce(
            (draft: ExchangeState, action: UpdateTransactionBufferAction) => {
                draft.form.buffer = action.payload;
            }
        ),
    },
    initialState
);
