import {TxDialogBody} from 'components/Dialog/TxDialog/TxDialogBody';
import {TxDialogFooter} from 'components/Dialog/TxDialog/TxDialogFooter';
import {TxDialogTitle} from 'components/Dialog/TxDialog/TxDialogTitle';
import React, {FC} from 'react';
import {SubmitType} from '../../../redux/actions/ui/txDialog.action';
import {TxDialogState} from '../../../redux/reducers/ui/txDialog.reducer';
import Dialog from '../Dialog';

export type TxDialogProps = {
    coreAssetId: number;
    method: string;
    signingAccount: string;
    success?: boolean;
    title: string;
    exchange;
    buffer?: number;
    liquidity;
    assetInfo: [];
    handleClose: () => void;
    handleExchangeSubmit: (arg0: SubmitType) => void;
    handleSendSubmit: (arg0: SubmitType) => void;
    handleLiquiditySubmit: (arg0: SubmitType) => void;
    handleComplete: () => void;
} & TxDialogState;

export const TxDialog: FC<TxDialogProps> = ({
    signingAccount,
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
    liquidity,
    assetInfo,
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
                    recipientAddress={undefined}
                    buffer={title === 'exchange' ? exchange.buffer : liquidity.buffer}
                    estimatedTxFee={estimatedTxFee}
                    txHash={txHash}
                    feeAssetId={feeAssetId}
                    actualTxFee={actualTxFee}
                    events={events}
                    assetInfo={assetInfo}
                />
            }
            footer={
                <TxDialogFooter
                    stage={stage}
                    error={error}
                    success={success}
                    onClose={handleClose}
                    onSubmit={() => {
                        if (title === 'exchange') {
                            handleExchangeSubmit({
                                ...exchange,
                                extrinsic,
                                feeInFeeAsset: estimatedTxFee.feeInFeeAsset,
                            });
                        } else if (title === 'liquidity') {
                            handleLiquiditySubmit({
                                ...liquidity,
                                extrinsic,
                                feeInFeeAsset: null,
                            });
                        }
                    }}
                    onComplete={handleComplete}
                />
            }
        />
    ) : (
        <></>
    );
};
