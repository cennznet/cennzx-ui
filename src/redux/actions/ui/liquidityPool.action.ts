import {createAction} from 'redux-actions';
import {BaseError} from '../../../error/error';
import {IAssetBalance, IExchangePool, IFee, ITxFeeParams, IUserBalance} from '../../../typings';
import {Amount} from '../../../util/Amount';

export enum LiquidityPoolActions {
    ADD_LIQUIDITY_INVESTOR_UPDATE = 'POOL/ADD_LIQUIDITY_INVESTOR_UPDATE',

    DEPOSIT_ASSET_UPDATE = 'POOL/DEPOSIT_ASSET_UPDATE',

    DEPOSIT_ASSET_AMOUNT_UPDATE = 'POOL/DEPOSIT_ASSET_AMOUNT_UPDATE',
    DEPOSIT_CORE_AMOUNT_UPDATE = 'POOL/DEPOSIT_ASSET_AMOUNT_UPDATE',

    DEPOSIT_ASSET_AMOUNT_SET = 'POOL/DEPOSIT_ASSET_AMOUNT_SET',
    DEPOSIT_CORE_AMOUNT_SET = 'POOL/DEPOSIT_ASSET_AMOUNT_SET',

    ADD_LIQUIDITY_BUFFER_UPDATE = 'POOL/ADD_LIQUIDITY_BUFFER_UPDATE',

    INVESTOR_FREE_BALANCE_UPDATE = 'POOL/INVESTOR_FREE_BALANCE_UPDATE',

    ADD_LIQUIDITY_FEE_ASSET_UPDATE = 'POOL/ADD_LIQUIDITY_FEE_ASSET_UPDATE',

    REMOVE_LIQUIDITY_INVESTOR_UPDATE = 'POOL/REMOVE_LIQUIDITY_INVESTOR_UPDATE',

    WITHDRAW_ASSET_UPDATE = 'POOL/WITHDRAW_ASSET_UPDATE',

    WITHDRAW_LIQUIDITY_UPDATE = 'POOL/WITHDRAW_LIQUIDITY_UPDATE',

    REMOVE_LIQUIDITY_BUFFER_UPDATE = 'POOL/REMOVE_LIQUIDITY_BUFFER_UPDATE',

    REMOVE_LIQUIDITY_FEE_ASSET_UPDATE = 'POOL/REMOVE_LIQUIDITY_FEE_ASSET_UPDATE',

    //estimatedAssetToWithdraw
    // ASSET_TO_WITHDRAW_UPDATE = 'POOL/ASSET_TO_WITHDRAW_UPDATE', // need to check if we can use reselect to set this.

    TRANSACTION_FEE_UPDATE = 'POOL/TRANSACTION_FEE_UPDATE',
    TRANSACTION_FEE_REMOVE_LIQUIDITY_REQUEST = 'POOL/TRANSACTION_FEE_REMOVE_LIQUIDITY_REQUEST',
    TRANSACTION_FEE_ADD_LIQUIDITY_REQUEST = 'POOL/TRANSACTION_FEE_ADD_LIQUIDITY_REQUEST',
    EXCHANGE_RATE_REQUEST = 'POOL/EXCHANGE_RATE_REQUEST',
    EXCHANGE_RATE_UPDATE = 'POOL/EXCHANGE_RATE_UPDATE',
    POOL_RESET = 'POOL/TRADE_RESET',
    EXTRINSIC_UPDATE = 'POOL/EXTRINSIC_UPDATE',
    EXCHANGE_POOL_BALANCE_UPDATE = 'POOL/EXCHANGE_POOL_BALANCE_UPDATE',
    TRANSACTION_FEE_PARAMS_UPDATE = 'POOL/TRANSACTION_FEE_PARAMS_UPDATE',
    ERROR_SET = 'POOL/ERROR_SET',
    USER_LIQUIDITY_UPDATE = 'POOL/USER_LIQUIDITY_UPDATE',
    USER_ASSET_BALANCE_FOR_REMOVE_LIQUIDITY_UPDATE = 'POOL/USER_ASSET_BALANCE_FOR_REMOVE_LIQUIDITY_UPDATE',
    USER_ASSET_BALANCE_FOR_ADD_LIQUIDITY_UPDATE = 'POOL/USER_ASSET_BALANCE_FOR_ADD_LIQUIDITY_UPDATE',
    USER_LIQUIDITY_REQUEST = 'POOL/USER_LIQUIDITY_REQUEST',
}

export const updateInvestorForAddLiquidity = createAction(
    LiquidityPoolActions.ADD_LIQUIDITY_INVESTOR_UPDATE,
    (account: string) => account
);

export const updateInvestorForRemoveLiquidity = createAction(
    LiquidityPoolActions.REMOVE_LIQUIDITY_INVESTOR_UPDATE,
    (account: string) => account
);

export const updateInvestmentAsset = createAction(
    LiquidityPoolActions.DEPOSIT_ASSET_UPDATE,
    (assetId: number) => assetId
);

export const updateWithdrawalAsset = createAction(
    LiquidityPoolActions.WITHDRAW_ASSET_UPDATE,
    (assetId: number) => assetId
);

export const setInvestmentAssetAmount = createAction(
    LiquidityPoolActions.DEPOSIT_ASSET_AMOUNT_SET,
    (assetAmount: Amount) => assetAmount
);

export const setInvestmentCoreAmount = createAction(
    LiquidityPoolActions.DEPOSIT_CORE_AMOUNT_SET,
    (assetAmount: Amount) => assetAmount
);

export const updateInvestmentAssetAmount = createAction(
    LiquidityPoolActions.DEPOSIT_ASSET_AMOUNT_UPDATE,
    (assetAmount: Amount) => assetAmount
);

export const updateInvestmentCoreAmount = createAction(
    LiquidityPoolActions.DEPOSIT_CORE_AMOUNT_UPDATE,
    (assetAmount: Amount) => assetAmount
);

export const updateAddLiquidityBuffer = createAction(
    LiquidityPoolActions.ADD_LIQUIDITY_BUFFER_UPDATE,
    (buffer: number) => buffer
);

export const updateInvestorFreeBalance = createAction(
    LiquidityPoolActions.INVESTOR_FREE_BALANCE_UPDATE,
    (userBal: IUserBalance) => userBal
);

export const updateInvestmentFeeAsset = createAction(
    LiquidityPoolActions.ADD_LIQUIDITY_FEE_ASSET_UPDATE,
    (feeAssetId: number) => feeAssetId
);

export const updateWithdrawalLiquidity = createAction(
    LiquidityPoolActions.WITHDRAW_LIQUIDITY_UPDATE,
    (liquidity: Amount) => liquidity
);

export const updateTransactionFee = createAction(LiquidityPoolActions.TRANSACTION_FEE_UPDATE, (fee: IFee) => fee);

export const updateRemoveLiquidityBuffer = createAction(
    LiquidityPoolActions.REMOVE_LIQUIDITY_BUFFER_UPDATE,
    (buffer: number) => buffer
);

export const updateWithdrawalFeeAsset = createAction(
    LiquidityPoolActions.REMOVE_LIQUIDITY_FEE_ASSET_UPDATE,
    (feeAssetId: number) => feeAssetId
);

export const requestExchangeRate = createAction(LiquidityPoolActions.EXCHANGE_RATE_REQUEST);

export const requestUserLiquidity = createAction(
    LiquidityPoolActions.USER_LIQUIDITY_REQUEST,
    (assetId: number, address: string) => ({assetId, address})
);

export const updateExchangeRate = createAction(
    LiquidityPoolActions.EXCHANGE_RATE_UPDATE,
    (exchangeRate: Amount) => exchangeRate
);

export const resetPool = createAction(LiquidityPoolActions.POOL_RESET);

export const updateExtrinsic = createAction(LiquidityPoolActions.EXTRINSIC_UPDATE, (extrinsic: string) => extrinsic);

export const updatePoolBalance = createAction(
    LiquidityPoolActions.EXCHANGE_POOL_BALANCE_UPDATE,
    (poolBalance: IExchangePool) => poolBalance
);

export const updateTxFeeParameter = createAction(
    LiquidityPoolActions.TRANSACTION_FEE_PARAMS_UPDATE,
    (txfeeParams: ITxFeeParams) => txfeeParams
);

export const setPoolError = createAction(LiquidityPoolActions.ERROR_SET, (errorMsg: BaseError) => errorMsg);

export const updateUserLiquidity = createAction(
    LiquidityPoolActions.USER_LIQUIDITY_UPDATE,
    (userLiquidity: Amount) => userLiquidity
);

export const updateUserPayAssetBalanceForAddLiquidity = createAction(
    LiquidityPoolActions.USER_ASSET_BALANCE_FOR_ADD_LIQUIDITY_UPDATE,
    (assetBalance: IAssetBalance) => assetBalance
);

export const updateUserPayAssetBalanceForWithdrawLiquidity = createAction(
    LiquidityPoolActions.USER_ASSET_BALANCE_FOR_REMOVE_LIQUIDITY_UPDATE,
    (assetBalance: IAssetBalance) => assetBalance
);

export type UpdateInvestorForAddLiquidityAction = ReturnType<typeof updateInvestorForAddLiquidity>;

export type UpdateInvestorForRemoveLiquidityAction = ReturnType<typeof updateInvestorForRemoveLiquidity>;

export type UpdateInvestmentAssetAction = ReturnType<typeof updateInvestmentAsset>;

export type UpdateWithdrawalAssetAction = ReturnType<typeof updateWithdrawalAsset>;

export type SetInvestmentAssetAmountAction = ReturnType<typeof setInvestmentAssetAmount>;

export type SetInvestmentCoreAmountAction = ReturnType<typeof setInvestmentCoreAmount>;

export type UpdateInvestmentAssetAmountAction = ReturnType<typeof updateInvestmentAssetAmount>;

export type UpdateInvestmentCoreAmountAction = ReturnType<typeof updateInvestmentCoreAmount>;

export type UpdateAddLiquidityBufferAction = ReturnType<typeof updateAddLiquidityBuffer>;

export type UpdateInvestorFreeBalanceAction = ReturnType<typeof updateInvestorFreeBalance>;

export type UpdateInvestmentFeeAssetAction = ReturnType<typeof updateInvestmentFeeAsset>;

export type UpdateWithdrawalLiquidityAction = ReturnType<typeof updateWithdrawalLiquidity>;

export type UpdateTransactionFeeAction = ReturnType<typeof updateTransactionFee>;

export type UpdateRemoveLiquidityBufferAction = ReturnType<typeof updateRemoveLiquidityBuffer>;

export type UpdateWithdrawalFeeAssetAction = ReturnType<typeof updateWithdrawalFeeAsset>;

export type RequestExchangeRateAction = ReturnType<typeof requestExchangeRate>;

export type RequestUserLiquidityAction = ReturnType<typeof requestUserLiquidity>;

export type UpdateExchangeRateAction = ReturnType<typeof updateExchangeRate>;

export type ResetPoolAction = ReturnType<typeof resetPool>;

export type UpdateExtrinsicAction = ReturnType<typeof updateExtrinsic>;

export type UpdatePoolBalanceAction = ReturnType<typeof updatePoolBalance>;

export type UpdateUserPayAssetBalanceForAddLiquidityAction = ReturnType<
    typeof updateUserPayAssetBalanceForAddLiquidity
>;

export type UpdateUserPayAssetBalanceForWithdrawLiquidityAction = ReturnType<
    typeof updateUserPayAssetBalanceForWithdrawLiquidity
>;

export type UpdateTxFeeParameterAction = ReturnType<typeof updateTxFeeParameter>;

export type SetPoolErrorAction = ReturnType<typeof setPoolError>;

export type UpdateUserLiquidityAction = ReturnType<typeof updateUserLiquidity>;

export default LiquidityPoolActions;
