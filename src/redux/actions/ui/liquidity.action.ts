import {createAction} from 'redux-actions';
import {BaseError} from '../../../error/error';
import {IAssetBalance, IAssetSwap, IExchangePool, IExtrinsic, IFee, IUserShareInPool} from '../../../typings';
import {Amount} from '../../../util/Amount';

export enum LiquidityActions {
    ADD1 = 'LIQUIDITY/ADD1',
    ADD2 = 'LIQUIDITY/ADD2',
    EXTRINSIC_UPDATE = 'LIQUIDITY/EXTRINSIC_UPDATE',
    SELECTED_ACCOUNT_UPDATE = 'LIQUIDITY/SELECTED_ACCOUNT_UPDATE',
    TO_ASSET_AMOUNT_SET = 'LIQUIDITY/TO_ASSET_AMOUNT_SET',
    SELECTED_ADD_ASSET1_UPDATE = 'LIQUIDITY/SELECTED_ADD_ASSET1_UPDATE',
    ADD_ASSET1_AMOUNT_SET = 'LIQUIDITY/ADD_ASSET1_AMOUNT_SET',
    ADD_ASSET2_AMOUNT_SET = 'LIQUIDITY/ADD_ASSET2_AMOUNT_SET',
    ADD_ASSET1_AMOUNT_UPDATE = 'LIQUIDITY/ADD_ASSET1_AMOUNT_UPDATE',
    ADD_ASSET2_AMOUNT_UPDATE = 'LIQUIDITY/ADD_ASSET2_AMOUNT_UPDATE',
    ERROR_SET = 'LIQUIDITY/ERROR_SET',
    ERROR_RESET = 'LIQUIDITY/ERROR_RESET',
    ERROR_REMOVE = 'LIQUIDITY/ERROR_REMOVE',
    LIQUIDITY_POOL_BALANCE_UPDATE = 'LIQUIDITY/LIQUIDITY_POOL_BALANCE_UPDATE',
    LIQUIDITY_TYPE = 'LIQUIDITY/LIQUIDITY_TYPE',
    ADD_LIQUIDITY = 'LIQUIDITY/ADD_LIQUIDITY',
    TRANSACTION_BUFFER_UPDATE = 'LIQUIDITY/TRANSACTION_BUFFER_UPDATE',
    SELECTED_TO_ASSET_UPDATE = 'LIQUIDITY/SELECTED_TO_ASSET_UPDATE',
    SELECTED_FROM_ASSET_UPDATE = 'LIQUIDITY/SELECTED_FROM_ASSET_UPDATE',
    FEE_ASSET_UPDATE = 'LIQUIDITY/FEE_ASSET_UPDATE',
    PAY_TRANSACTION_ASSET_SWAP = 'LIQUIDITY/PAY_TRANSACTION_ASSET_SWAP',
    ASSET_SWAP = 'LIQUIDITY/ASSET_SWAP',
    FROM_ASSET_AMOUNT_SET = 'LIQUIDITY/FROM_ASSET_AMOUNT_SET',
    TRADE_RESET = 'LIQUIDITY/TRADE_RESET',
    TRANSACTION_FEE_UPDATE = 'LIQUIDITY/TRANSACTION_FEE_UPDATE',
    TRANSACTION_FEE_PARAMS_UPDATE = 'LIQUIDITY/TRANSACTION_FEE_PARAMS_UPDATE',
    TRANSACTION_FEE_REQUEST = 'LIQUIDITY/TRANSACTION_FEE_REQUEST',
    EXCHANGE_RATE_UPDATE = 'LIQUIDITY/EXCHANGE_RATE_UPDATE',
    EXCHANGE_RATE_REQUEST = 'LIQUIDITY/EXCHANGE_RATE_REQUEST',
    GET_POOL = 'LIQUIDITY/GET_POOL',
    ASSET_BALANCE_REQUEST = 'LIQUIDITY/ASSET_BALANCE_REQUEST',
    ASSET_ADD1_BALANCE_REQUEST = 'LIQUIDITY/ASSET_ADD1_BALANCE_REQUEST',
    USER_ASSET_BALANCE_UPDATE = 'LIQUIDITY/USER_ASSET_BALANCE_UPDATE',
    USER_ADD_ASSET1_BALANCE_UPDATE = 'LIQUIDITY/USER_ADD_ASSET1_BALANCE_UPDATE',
    USER_POOL_SHARE_UPDATE = 'LIQUIDITY/USER_POOL_SHARE_UPDATE',
    TOTAL_LIQUIDITY_REQUEST = 'LIQUIDITY/TOTAL_LIQUIDITY_REQUEST',
    TOTAL_LIQUIDITY_UPDATE = 'LIQUIDITY/TOTAL_LIQUIDITY_UPDATE',
    POOL_BALANCE_REQUEST = 'LIQUIDITY/POOL_BALANCE_REQUEST',
    CORE_LIQUIDITY_PRICE_REQUEST = 'LIQUIDITY/CORE_LIQUIDITY_PRICE_REQUEST',
    ASSET_LIQUIDITY_PRICE_REQUEST = 'LIQUIDITY/ASSETLIQUIDITY_PRICE_REQUEST',
}

export const updateExtrinsic = createAction(LiquidityActions.EXTRINSIC_UPDATE, (extrinsic: string) => extrinsic);

export const setAdd1Amount = createAction(LiquidityActions.ADD1, (toAssetAmount: Amount) => toAssetAmount);

export const setLiquidityAction = createAction(
    LiquidityActions.LIQUIDITY_TYPE,
    (liquidityType: string) => liquidityType
);

export const setAdd2Amount = createAction(LiquidityActions.ADD2, (toAssetAmount: Amount) => toAssetAmount);

export const updateSelectedAccount = createAction(
    LiquidityActions.SELECTED_ACCOUNT_UPDATE,
    (account: string) => account
);
export const updateSelectedAddAsset1 = createAction(
    LiquidityActions.SELECTED_ADD_ASSET1_UPDATE,
    (assetId: number) => assetId
);
export const setAddAsset1Amount = createAction(
    LiquidityActions.ADD_ASSET1_AMOUNT_SET,
    (assetAmount: Amount) => assetAmount
);
export const updateAddAsset1Amount = createAction(
    LiquidityActions.ADD_ASSET1_AMOUNT_UPDATE,
    (assetAmount: Amount) => assetAmount
);
export const setAddAsset2Amount = createAction(
    LiquidityActions.ADD_ASSET2_AMOUNT_SET,
    (toAssetAmount: Amount) => toAssetAmount
);
export const updateAddAsset2Amount = createAction(
    LiquidityActions.ADD_ASSET2_AMOUNT_UPDATE,
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

export const requestAssetBalance = createAction(LiquidityActions.ASSET_BALANCE_REQUEST, (assetId, signingAccount) => {
    return {
        assetId,
        signingAccount,
    };
});
export const requestAddAsset1Balance = createAction(
    LiquidityActions.ASSET_ADD1_BALANCE_REQUEST,
    (assetId, signingAccount) => {
        return {
            assetId,
            signingAccount,
        };
    }
);
export const removeLiquidityError = createAction(LiquidityActions.ERROR_REMOVE, (err: BaseError) => err);

export const addLiquidity = createAction(LiquidityActions.ADD_LIQUIDITY);

export const updateTransactionBuffer = createAction(
    LiquidityActions.TRANSACTION_BUFFER_UPDATE,
    (buffer: number) => buffer
);
export const updateSelectedToAsset = createAction(
    LiquidityActions.SELECTED_TO_ASSET_UPDATE,
    (toAsset: number) => toAsset
);
export const updateSelectedFromAsset = createAction(
    LiquidityActions.SELECTED_FROM_ASSET_UPDATE,
    (fromAsset: number) => fromAsset
);
export const updateFeeAsset = createAction(LiquidityActions.FEE_ASSET_UPDATE, (assetId: number) => assetId);

export const swapPayTransactionAsset = createAction(LiquidityActions.PAY_TRANSACTION_ASSET_SWAP);
export const swapAsset = createAction(LiquidityActions.ASSET_SWAP);
export const setFromAssetAmount = createAction(
    LiquidityActions.FROM_ASSET_AMOUNT_SET,
    (fromAssetAmount: Amount) => fromAssetAmount
);
export const resetTrade = createAction(LiquidityActions.TRADE_RESET);

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
export const getPool = createAction(LiquidityActions.GET_POOL);
export const updateUserAssetBalance = createAction(
    LiquidityActions.USER_ASSET_BALANCE_UPDATE,
    (assetBalance: IAssetBalance) => assetBalance
);
export const updateUserAddAsset1Balance = createAction(
    LiquidityActions.USER_ADD_ASSET1_BALANCE_UPDATE,
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

export type UpdateTotalLiquidityAction = ReturnType<typeof updateTotalLiquidity>;
export type RequestLiquidityRateAction = ReturnType<typeof requestLiquidityRate>;
export type UpdateExchangeRateAction = ReturnType<typeof updateExchangeRate>;
export type RequestTransactionFeeAction = ReturnType<typeof requestTransactionFee>;
export type UpdateTxFeeParameterAction = ReturnType<typeof updateTxFeeParameter>;
export type UpdateTransactionFeeAction = ReturnType<typeof updateTransactionFee>;
export type ResetTradeAction = ReturnType<typeof resetTrade>;
export type SwapAssetAction = ReturnType<typeof swapAsset>;
export type SwapPayTransactionAssetAction = ReturnType<typeof swapPayTransactionAsset>;
export type UpdateFeeAssetAction = ReturnType<typeof updateFeeAsset>;
export type UpdateSelectedFromAssetAction = ReturnType<typeof updateSelectedFromAsset>;
export type UpdateSelectedToAssetAction = ReturnType<typeof updateSelectedToAsset>;
export type UpdateTransactionBufferAction = ReturnType<typeof updateTransactionBuffer>;
export type AddLiquidityAction = ReturnType<typeof addLiquidity>;
export type SetAdd1Action = ReturnType<typeof setAdd1Amount>;
export type SetAdd2Action = ReturnType<typeof setAdd2Amount>;
export type UpdateExtrinsicAction = ReturnType<typeof updateExtrinsic>;
export type UpdateSelectedAccountAction = ReturnType<typeof updateSelectedAccount>;
export type UpdateSelectedAddAsset1Action = ReturnType<typeof updateSelectedAddAsset1>;
export type UpdateAddAsset1AmountAction = ReturnType<typeof updateAddAsset1Amount>;
export type UpdateAddAsset2AmountAction = ReturnType<typeof updateAddAsset2Amount>;
export type SetAddAsset1AmountAction = ReturnType<typeof setAddAsset1Amount>;
export type SetAddAsset2AmountAction = ReturnType<typeof setAddAsset2Amount>;
export type SetLiquidityErrorAction = ReturnType<typeof setLiquidityError>;
export type ResetLiquidityErrorAction = ReturnType<typeof resetError>;
export type UpdatePoolBalanceAction = ReturnType<typeof updatePoolBalance>;
export type UpdateUserPoolShareAction = ReturnType<typeof updateUserPoolShare>;
export type SetLiquidityAction = ReturnType<typeof setLiquidityAction>;
export type RemoveLiquidityErrorAction = ReturnType<typeof removeLiquidityError>;

export type UpdateUserAssetBalanceAction = ReturnType<typeof updateUserAssetBalance>;
export type UpdateUserAddAsset1BalanceAction = ReturnType<typeof updateUserAddAsset1Balance>;
export type RequestAssetBalanceAction = ReturnType<typeof requestAssetBalance>;
export type RequestExchangeRateAction = ReturnType<typeof requestExchangeRate>;
export default LiquidityActions;
