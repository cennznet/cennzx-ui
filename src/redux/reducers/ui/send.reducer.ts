import produce from 'immer';
import {handleActions} from 'redux-actions';
import {BaseError} from '../../../error/error';
import {IAssetBalance, IExchangePool, IFee, SendFormData} from '../../../typings';
import {Amount} from '../../../util/Amount';
import SendActions, {
    RemoveSendErrorAction,
    ResetExchangeErrorAction,
    SetExchangeErrorAction,
    SetFromAssetAmountAction,
    SetToAssetAmountAction,
    UpdateExchangeRateAction,
    UpdateExtrinsicAction,
    UpdateFeeAssetAction,
    UpdateFromAssetAmountAction,
    UpdatePoolBalanceAction,
    UpdateRecipientAddressAction,
    UpdateSelectedAccountAction,
    UpdateSelectedFromAssetAction,
    UpdateSelectedToAssetAction,
    UpdateToAssetAmountAction,
    UpdateTransactionBufferAction,
    UpdateTransactionFeeAction,
    UpdateTxFeeParameterAction,
    UpdateUserAssetBalanceAction,
} from '../../actions/ui/send.action';

export interface SendState {
    exchangeRate?: Amount;
    exchangePool: IExchangePool[];
    txFee?: IFee;
    form: Partial<SendFormData>;
    userAssetBalance: IAssetBalance[];
    extrinsicParams?: any[];
    error: BaseError[];
}

export const initialState: SendState = {
    form: {feeAssetId: 16001, buffer: typeof window !== 'undefined' ? window.config.FEE_BUFFER : 0.05},
    exchangePool: [],
    userAssetBalance: [],
    error: [],
};

export default handleActions<SendState, any>(
    {
        [SendActions.RECIPIENT_ADDRESS]: produce((draft: SendState, action: UpdateRecipientAddressAction) => {
            draft.form.recipientAddress = action.payload;
        }),
        [SendActions.SELECTED_ACCOUNT_UPDATE]: produce((draft: SendState, action: UpdateSelectedAccountAction) => {
            draft.form.signingAccount = action.payload;
        }),
        [SendActions.SELECTED_FROM_ASSET_UPDATE]: produce((draft: SendState, action: UpdateSelectedFromAssetAction) => {
            draft.form.fromAsset = action.payload;
        }),
        [SendActions.SELECTED_TO_ASSET_UPDATE]: produce((draft: SendState, action: UpdateSelectedToAssetAction) => {
            draft.form.toAsset = action.payload;
        }),
        [SendActions.FROM_ASSET_AMOUNT_SET]: produce((draft: SendState, action: SetFromAssetAmountAction) => {
            draft.form.fromAssetAmount = action.payload;
        }),
        [SendActions.TO_ASSET_AMOUNT_SET]: produce((draft: SendState, action: SetToAssetAmountAction) => {
            draft.form.toAssetAmount = action.payload;
        }),
        [SendActions.FROM_ASSET_AMOUNT_UPDATE]: produce((draft: SendState, action: UpdateFromAssetAmountAction) => {
            draft.form.fromAssetAmount = action.payload;
        }),
        [SendActions.TO_ASSET_AMOUNT_UPDATE]: produce((draft: SendState, action: UpdateToAssetAmountAction) => {
            draft.form.toAssetAmount = action.payload;
        }),
        [SendActions.TRANSACTION_FEE_UPDATE]: produce((draft: SendState, action: UpdateTransactionFeeAction) => {
            draft.txFee = action.payload;
        }),
        [SendActions.SEND_RATE_UPDATE]: produce((draft: SendState, action: UpdateExchangeRateAction) => {
            draft.exchangeRate = action.payload;
        }),
        [SendActions.TRADE_RESET]: () => initialState,
        [SendActions.ASSET_SWAP]: produce((draft: SendState) => {
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
        [SendActions.EXTRINSIC_UPDATE]: produce((draft: SendState, action: UpdateExtrinsicAction) => {
            draft.form.extrinsic = action.payload;
        }),
        [SendActions.SEND_POOL_BALANCE_UPDATE]: produce((draft: SendState, action: UpdatePoolBalanceAction) => {
            const index = draft.exchangePool.findIndex(
                (poolData: IExchangePool) => poolData.assetId === action.payload.assetId
            );
            if (index === -1) {
                draft.exchangePool.push(action.payload);
            } else {
                draft.exchangePool[index] = action.payload;
            }
        }),
        [SendActions.USER_ASSET_BALANCE_UPDATE]: produce((draft: SendState, action: UpdateUserAssetBalanceAction) => {
            const index = draft.userAssetBalance.findIndex(
                (assetData: IAssetBalance) =>
                    assetData.assetId === draft.form.feeAssetId && assetData.account === draft.form.signingAccount
            );
            if (index === -1) {
                draft.userAssetBalance.push(action.payload);
            }
            draft.userAssetBalance[index] = action.payload;
        }),
        [SendActions.TRANSACTION_FEE_PARAMS_UPDATE]: produce((draft: SendState, action: UpdateTxFeeParameterAction) => {
            draft.extrinsicParams = action.payload;
        }),
        [SendActions.FEE_ASSET_UPDATE]: produce((draft: SendState, action: UpdateFeeAssetAction) => {
            draft.form.feeAssetId = action.payload;
        }),
        [SendActions.ERROR_SET]: produce((draft: SendState, action: SetExchangeErrorAction) => {
            draft.error.push(action.payload);
        }),
        [SendActions.ERROR_REMOVE]: produce((draft: SendState, action: RemoveSendErrorAction) => {
            const newErrorList = draft.error.filter(err => err !== action.payload);
            draft.error = newErrorList;
        }),
        [SendActions.ERROR_RESET]: produce((draft: SendState, action: ResetExchangeErrorAction) => {
            draft.error = [];
        }),
        [SendActions.TRANSACTION_BUFFER_UPDATE]: produce((draft: SendState, action: UpdateTransactionBufferAction) => {
            draft.form.buffer = action.payload;
        }),
    },
    initialState
);
