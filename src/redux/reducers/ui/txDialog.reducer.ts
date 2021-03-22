import {EventRecord} from '@plugnet/types';
import produce from 'immer';
import {handleActions} from 'redux-actions';
import {BaseError} from '../../../error/error';
import {IExtrinsic, IFee} from '../../../typings';
import {Amount} from '../../../util/Amount';
import TxDialogActions, {
    OpenTxDialogAction,
    RequestSubmitLiquidity,
    RequestSubmitSend,
    RequestSubmitTransaction,
    SetDailogErrorAction,
    UpdateActualFeeAction,
    UpdateStageAction,
    UpdateTxEventsAction,
    UpdateTxHashAction,
} from '../../actions/ui/txDialog.action';

export enum Stages {
    Signing = 'signing',
    Broadcasted = 'broadcasted',
    Finalised = 'finalised',
}

export interface TxDialogState {
    title?: string;
    signingAccount: string;
    extrinsic?: IExtrinsic;
    estimatedTxFee?: IFee;
    stage?: Stages;
    events: EventRecord[];
    txHash?: string;
    buffer?: any;
    actualTxFee?: Amount;
    error?: BaseError;
    feeAssetId?: number;
    feeInFeeAsset?: Amount;
    recipientAddress?: string;
    fromAssetBalance?: Amount;
}

export const initialState: TxDialogState = {
    title: '',
    events: [],
    signingAccount: '',
};

export default handleActions<TxDialogState, any>(
    {
        [TxDialogActions.DIALOG_CLOSE]: () => {
            return initialState;
        },
        [TxDialogActions.STAGE_UPDATE]: produce((draft: TxDialogState, action: UpdateStageAction) => {
            draft.stage = action.payload;
        }),
        [TxDialogActions.DIALOG_OPEN]: produce((draft: TxDialogState, action: OpenTxDialogAction) => {
            const {title, signingAccount, extrinsic, feeInFeeAsset, feeAssetId, fromAssetBalance} = action.payload;
            draft.title = title;
            draft.extrinsic = extrinsic;
            draft.estimatedTxFee = feeInFeeAsset;
            draft.signingAccount = signingAccount;
            draft.stage = Stages.Signing;
            draft.feeAssetId = feeAssetId;
            draft.fromAssetBalance = fromAssetBalance;
        }),
        [TxDialogActions.TX_ACTUAL_FEE_UPDATE]: produce((draft: TxDialogState, action: UpdateActualFeeAction) => {
            draft.actualTxFee = action.payload;
        }),
        [TxDialogActions.TX_EVENTS_UPDATE]: produce((draft: TxDialogState, action: UpdateTxEventsAction) => {
            draft.events = action.payload;
        }),
        [TxDialogActions.TX_HASH_UPDATE]: produce((draft: TxDialogState, action: UpdateTxHashAction) => {
            draft.txHash = action.payload;
        }),
        [TxDialogActions.ERROR_SET]: produce((draft: TxDialogState, action: SetDailogErrorAction) => {
            draft.error = action.payload;
        }),
        [TxDialogActions.TRANSACTION_SUBMIT_REQUEST]: produce(
            (draft: TxDialogState, action: RequestSubmitTransaction) => {
                const {extrinsic, signingAccount, feeAssetId, feeInFeeAsset, buffer} = action.payload;
                draft.extrinsic = extrinsic;
                draft.signingAccount = signingAccount;
                draft.feeAssetId = feeAssetId;
                draft.feeInFeeAsset = feeInFeeAsset;
                draft.buffer = buffer;
            }
        ),
        [TxDialogActions.TRANSACTION_SUBMIT_SEND]: produce((draft: TxDialogState, action: RequestSubmitSend) => {
            const {extrinsic, signingAccount, feeAssetId, feeInFeeAsset, fromAssetBalance} = action.payload;
            draft.extrinsic = extrinsic;
            draft.signingAccount = signingAccount;
            draft.feeAssetId = feeAssetId;
            draft.feeInFeeAsset = feeInFeeAsset;
            draft.fromAssetBalance = fromAssetBalance;
        }),
        [TxDialogActions.TRANSACTION_SUBMIT_LIQUIDITY]: produce(
            (draft: TxDialogState, action: RequestSubmitLiquidity) => {
                const {extrinsic, signingAccount, feeAssetId, feeInFeeAsset, buffer} = action.payload;
                draft.extrinsic = extrinsic;
                draft.signingAccount = signingAccount;
                draft.feeAssetId = feeAssetId;
                draft.buffer = buffer;
                draft.feeInFeeAsset = feeInFeeAsset;
            }
        ),
    },
    initialState
);
