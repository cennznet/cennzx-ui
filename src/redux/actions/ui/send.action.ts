import {createAction} from 'redux-actions';
import {BaseError} from '../../../error/error';
import {IAssetBalance, IAssetSwap, IExchangePool, IExtrinsic, IFee} from '../../../typings';
import {Amount} from '../../../util/Amount';

export enum SendActions {
    SELECTED_ACCOUNT_UPDATE = 'SEND/SELECTED_ACCOUNT_UPDATE',
    SELECTED_FROM_ASSET_UPDATE = 'SEND/SELECTED_FROM_ASSET_UPDATE',
    SELECTED_TO_ASSET_UPDATE = 'SEND/SELECTED_TO_ASSET_UPDATE',
    FROM_ASSET_AMOUNT_SET = 'SEND/FROM_ASSET_AMOUNT_SET',
    TO_ASSET_AMOUNT_SET = 'SEND/TO_ASSET_AMOUNT_SET',
    FROM_ASSET_AMOUNT_UPDATE = 'SEND/FROM_ASSET_AMOUNT_UPDATE',
    TO_ASSET_AMOUNT_UPDATE = 'SEND/TO_ASSET_AMOUNT_UPDATE',
    FROM_ASSET_BALANCE_UPDATE = 'SEND/FROM_ASSET_BALANCE_UPDATE',
    TRANSACTION_FEE_UPDATE = 'SEND/TRANSACTION_FEE_UPDATE',
    TRANSACTION_FEE_REQUEST = 'SEND/TRANSACTION_FEE_REQUEST',
    SEND_RATE_REQUEST = 'SEND/SEND_RATE_REQUEST',
    SEND_RATE_UPDATE = 'SEND/SEND_RATE_UPDATE',
    TRADE_RESET = 'SEND/TRADE_RESET',
    ASSET_SWAP = 'SEND/ASSET_SWAP',
    EXTRINSIC_UPDATE = 'SEND/EXTRINSIC_UPDATE',
    SEND_POOL_BALANCE_UPDATE = 'SEND/SEND_POOL_BALANCE_UPDATE',
    FEE_ASSET_UPDATE = 'SEND/FEE_ASSET_UPDATE',
    USER_ASSET_BALANCE_UPDATE = 'SEND/USER_ASSET_BALANCE_UPDATE',
    TRANSACTION_BUFFER_UPDATE = 'SEND/TRANSACTION_BUFFER_UPDATE',
    TRANSACTION_FEE_PARAMS_UPDATE = 'SEND/TRANSACTION_FEE_PARAMS_UPDATE',
    ERROR_SET = 'SEND/ERROR_SET',
    ERROR_RESET = 'SEND/ERROR_RESET',
    ERROR_REMOVE = 'SEND/ERROR_REMOVE',
    ASSET_BALANCE_REQUEST = 'SEND/ASSET_BALANCE_REQUEST',
    PAY_TRANSACTION_ASSET_SWAP = 'PAY_TRANSACTION_ASSET_SWAP',
    RECIPIENT_ADDRESS = 'SEND/RECIPIENT_ADDRESS',
}

export const updateSelectedAccount = createAction(SendActions.SELECTED_ACCOUNT_UPDATE, (account: string) => account);

export const updateSelectedFromAsset = createAction(
    SendActions.SELECTED_FROM_ASSET_UPDATE,
    (fromAsset: number) => fromAsset
);

export const updateSelectedToAsset = createAction(SendActions.SELECTED_TO_ASSET_UPDATE, (toAsset: number) => toAsset);

export const setFromAssetAmount = createAction(
    SendActions.FROM_ASSET_AMOUNT_SET,
    (fromAssetAmount: Amount) => fromAssetAmount
);

export const setToAssetAmount = createAction(SendActions.TO_ASSET_AMOUNT_SET, (toAssetAmount: Amount) => toAssetAmount);

export const updateFromAssetAmount = createAction(
    SendActions.FROM_ASSET_AMOUNT_UPDATE,
    (fromAssetAmount: Amount) => fromAssetAmount
);

export const updateToAssetAmount = createAction(
    SendActions.TO_ASSET_AMOUNT_UPDATE,
    (toAssetAmount: Amount) => toAssetAmount
);

export const updateFeeAsset = createAction(SendActions.FEE_ASSET_UPDATE, (assetId: number) => assetId);

export const updateUserAssetBalance = createAction(
    SendActions.USER_ASSET_BALANCE_UPDATE,
    (assetBalance: IAssetBalance) => assetBalance
);

export const updateTransactionFee = createAction(SendActions.TRANSACTION_FEE_UPDATE, (fee: IFee) => fee);

export const requestTransactionFee = createAction(SendActions.TRANSACTION_FEE_REQUEST);

export const requestAssetBalance = createAction(SendActions.ASSET_BALANCE_REQUEST, (assetId, signingAccount) => ({
    assetId,
    signingAccount,
}));

export const requestExchangeRate = createAction(SendActions.SEND_RATE_REQUEST);

export const updateExchangeRate = createAction(SendActions.SEND_RATE_UPDATE, (exchangeRate: Amount) => exchangeRate);

export const resetTrade = createAction(SendActions.TRADE_RESET);

export const swapAsset = createAction(SendActions.ASSET_SWAP);

export const swapPayTransactionAsset = createAction(SendActions.PAY_TRANSACTION_ASSET_SWAP);

export const updateExtrinsic = createAction(SendActions.EXTRINSIC_UPDATE, (extrinsic: string) => extrinsic);

export const updatePoolBalance = createAction(
    SendActions.SEND_POOL_BALANCE_UPDATE,
    (poolBalance: IExchangePool) => poolBalance
);

export const updateTxFeeParameter = createAction(
    SendActions.TRANSACTION_FEE_PARAMS_UPDATE,
    (feeParams: any[]) => feeParams
);

export const updateTransactionBuffer = createAction(SendActions.TRANSACTION_BUFFER_UPDATE, (buffer: number) => buffer);

export const updateRecipientAddress = createAction(
    SendActions.RECIPIENT_ADDRESS,
    (recipientAddress: string) => recipientAddress
);

export const setExchangeError = createAction(SendActions.ERROR_SET, (error: BaseError) => error);

export const removeSendError = createAction(SendActions.ERROR_REMOVE, (err: BaseError) => err);

export const resetError = createAction(SendActions.ERROR_RESET);

export type UpdateRecipientAddressAction = ReturnType<typeof updateRecipientAddress>;

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

export type UpdateExtrinsicAction = ReturnType<typeof updateExtrinsic>;

export type UpdatePoolBalanceAction = ReturnType<typeof updatePoolBalance>;

export type UpdateUserAssetBalanceAction = ReturnType<typeof updateUserAssetBalance>;

export type UpdateFeeAssetAction = ReturnType<typeof updateFeeAsset>;

export type UpdateTxFeeParameterAction = ReturnType<typeof updateTxFeeParameter>;

export type SetExchangeErrorAction = ReturnType<typeof setExchangeError>;

export type ResetExchangeErrorAction = ReturnType<typeof resetError>;

export type RemoveSendErrorAction = ReturnType<typeof removeSendError>;

export type UpdateTransactionBufferAction = ReturnType<typeof updateTransactionBuffer>;

export default SendActions;
