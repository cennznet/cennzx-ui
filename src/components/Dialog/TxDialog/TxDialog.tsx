import {TxDialogBody} from 'components/Dialog/TxDialog/TxDialogBody';
import {TxDialogFooter} from 'components/Dialog/TxDialog/TxDialogFooter';
import {TxDialogTitle} from 'components/Dialog/TxDialog/TxDialogTitle';
import React, {FC} from 'react';
import {TxDialogState} from '../../../redux/reducers/ui/txDialog.reducer';
import {SubmitType} from '../../../redux/actions/ui/txDialog.action';
import Dialog from '../Dialog';

export type TxDialogProps = {
    coreAssetId: number;
    method: string;
    signingAccount: string;
    success?: boolean;
    title: string;
    exchange;
    send;
    buffer: number;
    liquidity;
    handleClose: () => void;
    handleExchangeSubmit: (arg0: SubmitType) => void;
    handleSendSubmit: (arg0: SubmitType) => void;
    handleLiquiditySubmit: (arg0: SubmitType) => void;
    handleComplete: () => void;
} & TxDialogState;

export const TxDialog: FC<TxDialogProps> = ({
    signingAccount,
    isAccountLocked,
    actualTxFee,
    feeAssetId,
    extrinsic,
    error,
    estimatedTxFee,
    stage,
    title,
    method,
    success,
    buffer,
    coreAssetId,
    txHash,
    events,
    fromAssetBalance,
    exchange,
    send,
    liquidity,
    handleClose,
    handleExchangeSubmit,
    handleSendSubmit,
    handleLiquiditySubmit,
    handleComplete,
}) => {
    return stage ? (
        <Dialog
            isOpen={true}
            title={<TxDialogTitle title={title} error={error} stage={stage} method={method} success={success} />}
            body={
                <TxDialogBody
                    stage={stage}
                    extrinsic={extrinsic}
                    coreAssetId={coreAssetId}
                    error={error}
                    success={success}
                    recipientAddress={title === 'send' && send.recipientAddress}
                    buffer={title === 'exchange' ? exchange.buffer : liquidity.buffer}
                    estimatedTxFee={estimatedTxFee}
                    txHash={txHash}
                    feeAssetId={feeAssetId}
                    actualTxFee={actualTxFee}
                    events={events}
                />
            }
            footer={
                <TxDialogFooter
                    stage={stage}
                    error={error}
                    success={success}
                    onClose={handleClose}
                    onSubmit={pass => {
                        if (title === 'exchange') {
                            handleExchangeSubmit({
                                ...exchange,
                                extrinsic,
                                feeInFeeAsset: estimatedTxFee.feeInFeeAsset,
                                password: pass,
                            });
                        } else if (title === 'liquidity') {
                            handleLiquiditySubmit({
                                ...liquidity,
                                extrinsic,
                                feeInFeeAsset: null,
                                password: pass,
                            });
                        }
                    }}
                    onComplete={handleComplete}
                    isAccountLocked={isAccountLocked}
                />
            }
        />
    ) : (
        <></>
    );
};
