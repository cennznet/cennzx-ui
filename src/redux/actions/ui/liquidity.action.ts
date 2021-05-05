import {createAction} from 'redux-actions';
import {BaseError} from '../../../error/error';
import {IAssetBalance, IAssetSwap, IExchangePool, IExtrinsic, IFee, IUserShareInPool} from '../../../typings';
import {Amount} from '../../../util/Amount';

export enum LiquidityActions {
    EXTRINSIC_UPDATE = 'LIQUIDITY/EXTRINSIC_UPDATE',
    SELECTED_ACCOUNT_UPDATE = 'LIQUIDITY/SELECTED_ACCOUNT_UPDATE',
    SELECTED_ASSET1_UPDATE = 'LIQUIDITY/SELECTED_ASSET1_UPDATE',
    ASSET1_AMOUNT_SET = 'LIQUIDITY/ASSET1_AMOUNT_SET',
    ASSET2_AMOUNT_SET = 'LIQUIDITY/ASSET2_AMOUNT_SET', // asset2 - core asset
    ASSET1_AMOUNT_UPDATE = 'LIQUIDITY/ASSET1_AMOUNT_UPDATE',
    ASSET2_AMOUNT_UPDATE = 'LIQUIDITY/ASSET2_AMOUNT_UPDATE',
    ERROR_SET = 'LIQUIDITY/ERROR_SET',
    ERROR_RESET = 'LIQUIDITY/ERROR_RESET',
    ERROR_REMOVE = 'LIQUIDITY/ERROR_REMOVE',
    LIQUIDITY_POOL_BALANCE_UPDATE = 'LIQUIDITY/LIQUIDITY_POOL_BALANCE_UPDATE',
    LIQUIDITY_TYPE = 'LIQUIDITY/LIQUIDITY_TYPE',
    TRANSACTION_BUFFER_UPDATE = 'LIQUIDITY/TRANSACTION_BUFFER_UPDATE',
    FEE_ASSET_UPDATE = 'LIQUIDITY/FEE_ASSET_UPDATE',
    TRANSACTION_FEE_UPDATE = 'LIQUIDITY/TRANSACTION_FEE_UPDATE',
    TRANSACTION_FEE_PARAMS_UPDATE = 'LIQUIDITY/TRANSACTION_FEE_PARAMS_UPDATE',
    TRANSACTION_FEE_REQUEST = 'LIQUIDITY/TRANSACTION_FEE_REQUEST',
    EXCHANGE_RATE_UPDATE = 'LIQUIDITY/EXCHANGE_RATE_UPDATE',
    EXCHANGE_RATE_REQUEST = 'LIQUIDITY/EXCHANGE_RATE_REQUEST',
    USER_ASSET_BALANCE_REQUEST = 'LIQUIDITY/USER_ASSET_BALANCE_REQUEST',
    USER_ASSET_BALANCE_UPDATE = 'LIQUIDITY/USER_ASSET_BALANCE_UPDATE',
    USER_POOL_SHARE_UPDATE = 'LIQUIDITY/USER_POOL_SHARE_UPDATE',
    TOTAL_LIQUIDITY_REQUEST = 'LIQUIDITY/TOTAL_LIQUIDITY_REQUEST',
    TOTAL_LIQUIDITY_UPDATE = 'LIQUIDITY/TOTAL_LIQUIDITY_UPDATE',
    POOL_BALANCE_REQUEST = 'LIQUIDITY/POOL_BALANCE_REQUEST',
    CORE_LIQUIDITY_PRICE_REQUEST = 'LIQUIDITY/CORE_LIQUIDITY_PRICE_REQUEST',
    ASSET_LIQUIDITY_PRICE_REQUEST = 'LIQUIDITY/ASSETLIQUIDITY_PRICE_REQUEST',
    LIQUIDITY_TO_WITHDRAW_UPDATE = 'LIQUIDITY/LIQUIDITY_TO_WITHDRAW_UPDATE',
    LIQUIDITY_RESET = 'LIQUIDITY/LIQUIDITY_RESET',
}

export const updateExtrinsic = createAction(LiquidityActions.EXTRINSIC_UPDATE, (extrinsic: string) => extrinsic);

export const setLiquidityAction = createAction(
    LiquidityActions.LIQUIDITY_TYPE,
    (liquidityType: string) => liquidityType
);

export const updateSelectedAccount = createAction(
    LiquidityActions.SELECTED_ACCOUNT_UPDATE,
    (account: string) => account
);
export const updateSelectedAsset1 = createAction(LiquidityActions.SELECTED_ASSET1_UPDATE, (assetId: number) => assetId);
export const setAsset1Amount = createAction(LiquidityActions.ASSET1_AMOUNT_SET, (assetAmount: Amount) => assetAmount);
export const updateAsset1Amount = createAction(
    LiquidityActions.ASSET1_AMOUNT_UPDATE,
    (assetAmount: Amount) => assetAmount
);
export const setAsset2Amount = createAction(
    LiquidityActions.ASSET2_AMOUNT_SET,
    (toAssetAmount: Amount) => toAssetAmount
);
export const updateAsset2Amount = createAction(
    LiquidityActions.ASSET2_AMOUNT_UPDATE,
    (toAssetAmount: Amount) => toAssetAmount
);
export const setLiquidityError = createAction(LiquidityActions.ERROR_SET, (error: BaseError) => error);
export const resetError = createAction(LiquidityActions.ERROR_RESET);
export const updatePoolBalance = createAction(
    LiquidityActions.LIQUIDITY_POOL_BALANCE_UPDATE,
    (poolBalance: IExchangePool) => poolBalance
);

export const updateUserPoolShare = createAction(
    LiquidityActions.USER_POOL_SHARE_UPDATE,
    (userShareInPool: IUserShareInPool) => userShareInPool
);

export const requestUserAssetBalance = createAction(
    LiquidityActions.USER_ASSET_BALANCE_REQUEST,
    (assetId, signingAccount) => {
        return {
            assetId,
            signingAccount,
        };
    }
);

export const removeLiquidityError = createAction(LiquidityActions.ERROR_REMOVE, (err: BaseError) => err);

export const updateTransactionBuffer = createAction(
    LiquidityActions.TRANSACTION_BUFFER_UPDATE,
    (buffer: number) => buffer
);

export const updateFeeAsset = createAction(LiquidityActions.FEE_ASSET_UPDATE, (assetId: number) => assetId);

export const updateTransactionFee = createAction(LiquidityActions.TRANSACTION_FEE_UPDATE, (fee: IFee) => fee);
export const updateTxFeeParameter = createAction(
    LiquidityActions.TRANSACTION_FEE_PARAMS_UPDATE,
    (feeParams: any[]) => feeParams
);

export const requestExchangeRate = createAction(LiquidityActions.EXCHANGE_RATE_REQUEST);
export const requestCoreLiquidityPrice = createAction(LiquidityActions.CORE_LIQUIDITY_PRICE_REQUEST);
export const requestAssetLiquidityPrice = createAction(LiquidityActions.ASSET_LIQUIDITY_PRICE_REQUEST);
export const requestTransactionFee = createAction(LiquidityActions.TRANSACTION_FEE_REQUEST);
export const updateExchangeRate = createAction(
    LiquidityActions.EXCHANGE_RATE_UPDATE,
    (exchangeRate: Amount) => exchangeRate
);
export const requestPoolBalance = createAction(LiquidityActions.POOL_BALANCE_REQUEST, (assetId: number) => assetId);

export const requestLiquidityRate = createAction(LiquidityActions.EXCHANGE_RATE_REQUEST);
export const updateUserAssetBalance = createAction(
    LiquidityActions.USER_ASSET_BALANCE_UPDATE,
    (assetBalance: IAssetBalance) => assetBalance
);

export const requestTotalLiquidity = createAction(
    LiquidityActions.TOTAL_LIQUIDITY_REQUEST,
    (assetId: number) => assetId
);

export const updateTotalLiquidity = createAction(
    LiquidityActions.TOTAL_LIQUIDITY_UPDATE,
    (liquidity: Amount) => liquidity
);

export const updateLiquidityForWithdrawal = createAction(
    LiquidityActions.LIQUIDITY_TO_WITHDRAW_UPDATE,
    (liquidity: Amount) => liquidity
);

export const resetLiquidity = createAction(LiquidityActions.LIQUIDITY_RESET);

export type UpdateLiquidityForWithdrawalAction = ReturnType<typeof updateLiquidityForWithdrawal>;
export type UpdateTotalLiquidityAction = ReturnType<typeof updateTotalLiquidity>;
export type RequestLiquidityRateAction = ReturnType<typeof requestLiquidityRate>;
export type UpdateExchangeRateAction = ReturnType<typeof updateExchangeRate>;
export type RequestTransactionFeeAction = ReturnType<typeof requestTransactionFee>;
export type UpdateTxFeeParameterAction = ReturnType<typeof updateTxFeeParameter>;
export type UpdateTransactionFeeAction = ReturnType<typeof updateTransactionFee>;
export type UpdateFeeAssetAction = ReturnType<typeof updateFeeAsset>;
export type UpdateTransactionBufferAction = ReturnType<typeof updateTransactionBuffer>;
export type UpdateExtrinsicAction = ReturnType<typeof updateExtrinsic>;
export type UpdateSelectedAccountAction = ReturnType<typeof updateSelectedAccount>;
export type UpdateSelectedAsset1Action = ReturnType<typeof updateSelectedAsset1>;
export type UpdateAsset1AmountAction = ReturnType<typeof updateAsset1Amount>;
export type UpdateAsset2AmountAction = ReturnType<typeof updateAsset2Amount>;
export type SetAsset1AmountAction = ReturnType<typeof setAsset1Amount>;
export type SetAsset2AmountAction = ReturnType<typeof setAsset2Amount>;
export type SetLiquidityErrorAction = ReturnType<typeof setLiquidityError>;
export type ResetLiquidityErrorAction = ReturnType<typeof resetError>;
export type UpdatePoolBalanceAction = ReturnType<typeof updatePoolBalance>;
export type UpdateUserPoolShareAction = ReturnType<typeof updateUserPoolShare>;
export type SetLiquidityAction = ReturnType<typeof setLiquidityAction>;
export type RemoveLiquidityErrorAction = ReturnType<typeof removeLiquidityError>;

export type UpdateUserAssetBalanceAction = ReturnType<typeof updateUserAssetBalance>;
export type RequestUserAssetBalanceAction = ReturnType<typeof requestUserAssetBalance>;
export type RequestExchangeRateAction = ReturnType<typeof requestExchangeRate>;
export default LiquidityActions;
