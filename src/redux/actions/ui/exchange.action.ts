import {createAction} from 'redux-actions';
import {BaseError} from '../../../error/error';
import {IAssetBalance, IAssetSwap, IExchangePool, IExtrinsic, IFee} from '../../../typings';
import {Amount} from '../../../util/Amount';

export enum ExchangeActions {
    SELECTED_ACCOUNT_UPDATE = 'EXCHANGE/SELECTED_ACCOUNT_UPDATE',
    SELECTED_FROM_ASSET_UPDATE = 'EXCHANGE/SELECTED_FROM_ASSET_UPDATE',
    SELECTED_TO_ASSET_UPDATE = 'EXCHANGE/SELECTED_TO_ASSET_UPDATE',
    FROM_ASSET_AMOUNT_SET = 'EXCHANGE/FROM_ASSET_AMOUNT_SET',
    TO_ASSET_AMOUNT_SET = 'EXCHANGE/TO_ASSET_AMOUNT_SET',
    FROM_ASSET_AMOUNT_UPDATE = 'EXCHANGE/FROM_ASSET_AMOUNT_UPDATE',
    TO_ASSET_AMOUNT_UPDATE = 'EXCHANGE/TO_ASSET_AMOUNT_UPDATE',
    FROM_ASSET_BALANCE_UPDATE = 'EXCHANGE/FROM_ASSET_BALANCE_UPDATE',
    TRANSACTION_FEE_UPDATE = 'EXCHANGE/TRANSACTION_FEE_UPDATE',
    TRANSACTION_FEE_REQUEST = 'EXCHANGE/TRANSACTION_FEE_REQUEST',
    EXCHANGE_RATE_REQUEST = 'EXCHANGE/EXCHANGE_RATE_REQUEST',
    EXCHANGE_RATE_UPDATE = 'EXCHANGE/EXCHANGE_RATE_UPDATE',
    TRADE_RESET = 'EXCHANGE/TRADE_RESET',
    ASSET_SWAP = 'EXCHANGE/ASSET_SWAP',
    EXTRINSIC_UPDATE = 'EXCHANGE/EXTRINSIC_UPDATE',
    EXCHANGE_POOL_BALANCE_UPDATE = 'EXCHANGE/EXCHANGE_POOL_BALANCE_UPDATE',
    FEE_ASSET_UPDATE = 'EXCHANGE/FEE_ASSET_UPDATE',
    USER_ASSET_BALANCE_UPDATE = 'EXCHANGE/USER_ASSET_BALANCE_UPDATE',
    TRANSACTION_BUFFER_UPDATE = 'EXCHANGE/TRANSACTION_BUFFER_UPDATE',
    TRANSACTION_FEE_PARAMS_UPDATE = 'EXCHANGE/TRANSACTION_FEE_PARAMS_UPDATE',
    ERROR_SET = 'EXCHANGE/ERROR_SET',
    ERROR_RESET = 'EXCHANGE/ERROR_RESET',
    ERROR_REMOVE = 'EXCHANGE/ERROR_REMOVE',
    ASSET_BALANCE_REQUEST = 'EXCHANGE/ASSET_BALANCE_REQUEST',
    PAY_TRANSACTION_ASSET_SWAP = 'PAY_TRANSACTION_ASSET_SWAP',
}

export const updateSelectedAccount = createAction(
    ExchangeActions.SELECTED_ACCOUNT_UPDATE,
    (account: string) => account
);

export const updateSelectedFromAsset = createAction(
    ExchangeActions.SELECTED_FROM_ASSET_UPDATE,
    (fromAsset: number) => fromAsset
);

export const updateSelectedToAsset = createAction(
    ExchangeActions.SELECTED_TO_ASSET_UPDATE,
    (toAsset: number) => toAsset
);

export const setFromAssetAmount = createAction(
    ExchangeActions.FROM_ASSET_AMOUNT_SET,
    (fromAssetAmount: Amount) => fromAssetAmount
);

export const setToAssetAmount = createAction(
    ExchangeActions.TO_ASSET_AMOUNT_SET,
    (toAssetAmount: Amount) => toAssetAmount
);

export const updateFromAssetAmount = createAction(
    ExchangeActions.FROM_ASSET_AMOUNT_UPDATE,
    (fromAssetAmount: Amount) => fromAssetAmount
);

export const updateToAssetAmount = createAction(
    ExchangeActions.TO_ASSET_AMOUNT_UPDATE,
    (toAssetAmount: Amount) => toAssetAmount
);

export const updateFeeAsset = createAction(ExchangeActions.FEE_ASSET_UPDATE, (assetId: number) => assetId);

export const updateUserAssetBalance = createAction(
    ExchangeActions.USER_ASSET_BALANCE_UPDATE,
    (assetBalance: IAssetBalance) => assetBalance
);

export const updateTransactionFee = createAction(ExchangeActions.TRANSACTION_FEE_UPDATE, (fee: IFee) => fee);

export const requestTransactionFee = createAction(ExchangeActions.TRANSACTION_FEE_REQUEST);

export const requestAssetBalance = createAction(ExchangeActions.ASSET_BALANCE_REQUEST, (assetId, signingAccount) => {
    return {
        assetId,
        signingAccount,
    };
});

export const requestExchangeRate = createAction(ExchangeActions.EXCHANGE_RATE_REQUEST);

export const updateExchangeRate = createAction(
    ExchangeActions.EXCHANGE_RATE_UPDATE,
    (exchangeRate: Amount) => exchangeRate
);

export const resetTrade = createAction(ExchangeActions.TRADE_RESET);

export const swapAsset = createAction(ExchangeActions.ASSET_SWAP);

export const swapPayTransactionAsset = createAction(ExchangeActions.PAY_TRANSACTION_ASSET_SWAP);

export const updateExtrinsic = createAction(ExchangeActions.EXTRINSIC_UPDATE, (extrinsic: string) => extrinsic);

export const updatePoolBalance = createAction(
    ExchangeActions.EXCHANGE_POOL_BALANCE_UPDATE,
    (poolBalance: IExchangePool) => poolBalance
);

export const updateTxFeeParameter = createAction(
    ExchangeActions.TRANSACTION_FEE_PARAMS_UPDATE,
    (feeParams: any[]) => feeParams
);

export const updateTransactionBuffer = createAction(
    ExchangeActions.TRANSACTION_BUFFER_UPDATE,
    (buffer: number) => buffer
);

export const setExchangeError = createAction(ExchangeActions.ERROR_SET, (error: BaseError) => error);

export const removeExchangeError = createAction(ExchangeActions.ERROR_REMOVE, (err: BaseError) => err);

export const resetError = createAction(ExchangeActions.ERROR_RESET);

export type UpdateSelectedAccountAction = ReturnType<typeof updateSelectedAccount>;

export type UpdateSelectedFromAssetAction = ReturnType<typeof updateSelectedFromAsset>;

export type UpdateSelectedToAssetAction = ReturnType<typeof updateSelectedToAsset>;

export type SetFromAssetAmountAction = ReturnType<typeof setFromAssetAmount>;

export type SetToAssetAmountAction = ReturnType<typeof setToAssetAmount>;

export type UpdateFromAssetAmountAction = ReturnType<typeof updateFromAssetAmount>;

export type UpdateToAssetAmountAction = ReturnType<typeof updateToAssetAmount>;

export type UpdateTransactionFeeAction = ReturnType<typeof updateTransactionFee>;

export type RequestTransactionFeeAction = ReturnType<typeof requestTransactionFee>;

export type RequestExchangeRateAction = ReturnType<typeof requestExchangeRate>;

export type UpdateExchangeRateAction = ReturnType<typeof updateExchangeRate>;

export type SwapAssetAction = ReturnType<typeof swapAsset>;

export type SwapPayTransactionAssetAction = ReturnType<typeof swapPayTransactionAsset>;

export type UpdateExtrinsicAction = ReturnType<typeof updateExtrinsic>;

export type UpdatePoolBalanceAction = ReturnType<typeof updatePoolBalance>;

export type UpdateUserAssetBalanceAction = ReturnType<typeof updateUserAssetBalance>;

export type UpdateFeeAssetAction = ReturnType<typeof updateFeeAsset>;

export type UpdateTxFeeParameterAction = ReturnType<typeof updateTxFeeParameter>;

export type SetExchangeErrorAction = ReturnType<typeof setExchangeError>;

export type ResetExchangeErrorAction = ReturnType<typeof resetError>;

export type RemoveExchangeErrorAction = ReturnType<typeof removeExchangeError>;

export type UpdateTransactionBufferAction = ReturnType<typeof updateTransactionBuffer>;
export type RequestAssetBalanceAction = ReturnType<typeof requestAssetBalance>;

export default ExchangeActions;
