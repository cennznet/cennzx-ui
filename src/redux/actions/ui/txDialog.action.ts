import {EventRecord, Hash} from '@plugnet/types';
import BN from 'bn.js';
import {createAction} from 'redux-actions';
import {BaseError} from '../../../error/error';
import {IExtrinsic, IFee} from '../../../typings';
import {Amount} from '../../../util/Amount';
import {Stages} from '../../reducers/ui/txDialog.reducer';

export enum TxDialogActions {
    DIALOG_OPEN = 'TX_DIALOG/DIALOG_OPEN',
    DIALOG_CLOSE = 'TX_DIALOG/DIALOG_CLOSE',
    STAGE_UPDATE = 'TX_DIALOG/POP_UP_STAGE_UPDATE',
    TX_HASH_UPDATE = 'TX_DIALOG/TX_HASH_UPDATE',
    TX_ACTUAL_FEE_UPDATE = 'TX_DIALOG/TX_ACTUAL_FEE_UPDATE',
    TX_EVENTS_UPDATE = 'TX_DIALOG/TX_EVENT_UPDATE',
    TRANSACTION_SUBMIT_REQUEST = 'TX_DIALOG/TRANSACTION_SUBMIT_REQUEST',
    TRANSACTION_SUBMIT_SEND = 'TX_DIALOG/TRANSACTION_SUBMIT_SEND',
    TRANSACTION_SUBMIT_LIQUIDITY = 'TX_DIALOG/TRANSACTION_SUBMIT_LIQUIDITY',
    TX_ACTUAL_FEE_REQUEST = 'TX_DIALOG/TX_ACTUAL_FEE_REQUEST',
    ERROR_SET = 'TX_DIALOG/ERROR_SET',
}

export interface SubmitLiquidity {
    type: string;
    extrinsic: IExtrinsic;
    signingAccount: string;
    feeAssetId: number;
    feeInFeeAsset: IFee;
    add1Asset: number;
    add1Amount: Amount;
    add2Asset: number;
    add2Amount: Amount;
    add1Reserve: Amount;
    buffer: number;
}
export interface OpenDialog {
    title?: string;
    signingAccount: string;
    extrinsic: IExtrinsic;
    feeInFeeAsset: IFee;
    feeAssetId: number;
    recipientAddress?: string;
    fromAsset?: number;
    toAsset?: number;
    fromAssetAmount?: Amount;
    fromAssetBalance?: Amount;
    buffer?: number;
}

export interface SubmitType {
    title?: string;
    signingAccount: string;
    extrinsic: IExtrinsic;
    feeInFeeAsset: IFee;
    feeAssetId: number;
    buffer: number;
    recipientAddress?: string;
}

export const openDialog = createAction(
    TxDialogActions.DIALOG_OPEN,
    ({
        title,
        signingAccount,
        extrinsic,
        feeInFeeAsset,
        feeAssetId,
        recipientAddress,
        fromAsset,
        fromAssetBalance,
    }: OpenDialog) => ({
        title,
        signingAccount,
        extrinsic,
        feeInFeeAsset,
        feeAssetId,
        recipientAddress,
        fromAsset,
        fromAssetBalance,
    })
);

export const updateActualFee = createAction(TxDialogActions.TX_ACTUAL_FEE_UPDATE, (fee: Amount) => fee);

export const requestSubmitTransaction = createAction(
    TxDialogActions.TRANSACTION_SUBMIT_REQUEST,
    ({extrinsic, signingAccount, feeAssetId, feeInFeeAsset, buffer}) => ({
        extrinsic,
        signingAccount,
        feeAssetId,
        feeInFeeAsset,
        buffer,
    })
);
export const requestSubmitSend = createAction(
    TxDialogActions.TRANSACTION_SUBMIT_SEND,
    ({
        extrinsic,
        signingAccount,
        feeAssetId,
        feeInFeeAsset,
        recipientAddress,
        fromAsset,
        toAsset,
        fromAssetAmount,
        fromAssetBalance,
        buffer,
    }: OpenDialog) => ({
        extrinsic,
        signingAccount,
        feeAssetId,
        feeInFeeAsset,
        recipientAddress,
        fromAsset,
        toAsset,
        fromAssetAmount,
        fromAssetBalance,
        buffer,
    })
);

export const requestSubmitLiquidity = createAction(
    TxDialogActions.TRANSACTION_SUBMIT_LIQUIDITY,
    ({
        type,
        extrinsic,
        signingAccount,
        feeAssetId,
        feeInFeeAsset,
        add1Asset,
        add1Amount,
        add2Asset,
        add2Amount,
        add1Reserve,
        buffer,
    }: SubmitLiquidity) => ({
        type,
        extrinsic,
        signingAccount,
        feeAssetId,
        feeInFeeAsset,
        add1Asset,
        add1Amount,
        add2Asset,
        add2Amount,
        add1Reserve,
        buffer,
    })
);

export const updateStage = createAction(TxDialogActions.STAGE_UPDATE, (stage: Stages) => stage);

export const closeDialog = createAction(TxDialogActions.DIALOG_CLOSE);

export const updateTxHash = createAction(TxDialogActions.TX_HASH_UPDATE, (txHash: string) => txHash);

export const updateTxEvents = createAction(TxDialogActions.TX_EVENTS_UPDATE, (events: EventRecord[]) => events);

export const requestActualFee = createAction(
    TxDialogActions.TX_ACTUAL_FEE_REQUEST,
    (feeParams: {blockHash: Hash; extrinsicIndex: BN}) => feeParams
);

export const setDailogError = createAction(TxDialogActions.ERROR_SET, (err: BaseError) => err);

export type OpenTxDialogAction = ReturnType<typeof openDialog>;

export type UpdateActualFeeAction = ReturnType<typeof updateActualFee>;

export type UpdateStageAction = ReturnType<typeof updateStage>;

export type UpdateTxHashAction = ReturnType<typeof updateTxHash>;

export type UpdateTxEventsAction = ReturnType<typeof updateTxEvents>;

export type RequestActualFeeAction = ReturnType<typeof requestActualFee>;

export type RequestSubmitTransaction = ReturnType<typeof requestSubmitTransaction>;

export type RequestSubmitSend = ReturnType<typeof requestSubmitSend>;

export type RequestSubmitLiquidity = ReturnType<typeof requestSubmitLiquidity>;

export type SetDailogErrorAction = ReturnType<typeof setDailogError>;
export default TxDialogActions;
