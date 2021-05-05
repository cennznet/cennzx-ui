import {EventRecord, Hash} from '@cennznet/types';
import BN from 'bn.js';
import {createAction} from 'redux-actions';
import {BaseError} from '../../../error/error';
import {IExtrinsic, IFee} from '../../../typings';
import {Amount} from '../../../util/Amount';
import {Stages} from '../../reducers/ui/txDialog.reducer';
import ExchangeActions from './exchange.action';

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
    ERROR_RESET = 'TX_DIALOG/ERROR_RESET',
}

export interface SubmitLiquidity {
    extrinsic: IExtrinsic;
    signingAccount: string;
    feeAssetId: number;
    feeInFeeAsset: IFee;
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
    ({extrinsic, signingAccount, feeAssetId, feeInFeeAsset, buffer}: SubmitLiquidity) => {
        return {
            extrinsic,
            signingAccount,
            feeAssetId,
            feeInFeeAsset,
            buffer,
        };
    }
);

export const updateStage = createAction(TxDialogActions.STAGE_UPDATE, (stage: Stages) => stage);

export const closeDialog = createAction(TxDialogActions.DIALOG_CLOSE);

export const updateTxHash = createAction(TxDialogActions.TX_HASH_UPDATE, (txHash: string) => txHash);

export const updateTxEvents = createAction(TxDialogActions.TX_EVENTS_UPDATE, (events: EventRecord[]) => events);

export const requestActualFee = createAction(
    TxDialogActions.TX_ACTUAL_FEE_REQUEST,
    (feeParams: {blockHash: Hash; extrinsicIndex: BN}) => feeParams
);

export const setDialogError = createAction(TxDialogActions.ERROR_SET, (err: BaseError) => err);

export const resetDialogError = createAction(ExchangeActions.ERROR_RESET);

export type OpenTxDialogAction = ReturnType<typeof openDialog>;

export type UpdateActualFeeAction = ReturnType<typeof updateActualFee>;

export type UpdateStageAction = ReturnType<typeof updateStage>;

export type UpdateTxHashAction = ReturnType<typeof updateTxHash>;

export type UpdateTxEventsAction = ReturnType<typeof updateTxEvents>;

export type RequestActualFeeAction = ReturnType<typeof requestActualFee>;

export type RequestSubmitTransaction = ReturnType<typeof requestSubmitTransaction>;

export type RequestSubmitSend = ReturnType<typeof requestSubmitSend>;

export type RequestSubmitLiquidity = ReturnType<typeof requestSubmitLiquidity>;

export type SetDialogErrorAction = ReturnType<typeof setDialogError>;

export type ResetErrorAction = ReturnType<typeof resetDialogError>;

export default TxDialogActions;
