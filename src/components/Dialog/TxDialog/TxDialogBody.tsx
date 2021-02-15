import {EventRecord} from '@cennznet/types/polkadot';
import ExternalLink from 'components/ExternalLink';
import React, {FC, useState} from 'react';
import {Stages} from '../../../redux/reducers/ui/txDialog.reducer';
import {IExtrinsic, IFee} from '../../../typings';
import {Amount} from '../../../util/Amount';
import {getAsset} from '../../../util/assets';
import {SWAP_OUTPUT} from '../../../util/extrinsicUtil';
import styled from 'styled-components';
import {SummaryBuy} from '../../AdvancedSetting/SummaryBuy';
import SummaryFee from '../../AdvancedSetting/SummaryFee';
import TxSummaryEstimatedTxFeeForBody from 'components/TxSummary/TxSummaryEstimatedTxFeeForBody';
import BN from 'bn.js';

type AssetSwapParams = [number, number, Amount, Amount];

const DECIMALS = 5;

const getCennzScanURL = txHash => `https://www.uncoverexplorer.com/tx/${txHash}`;

const Em = styled.span`
    color: #1130ff;
`;

const BodyForSigning: FC<{
    error?: Error;
    extrinsic: IExtrinsic;
    feeInCpay: Amount;
    buffer: number;
    recipientAddress: string;
}> = ({error, feeInCpay, buffer, recipientAddress, extrinsic: {method, params, price}}) => {
    if (error) return <div>{error.message}</div>;
    const [assetA, assetB, amountB, amountA] = params as AssetSwapParams;
    const [fromAsset, toAsset, toAssetAmount, fromAssetAmount] =
        method === SWAP_OUTPUT ? [assetA, assetB, amountB, amountA] : [assetB, assetA, amountA, amountB];
    switch (method) {
        case 'buyAsset':
            return (
                <div>
                    <p>Please check over the transaction details below :</p>
                    <>
                        <p>
                            You are buying{' '}
                            <Em>
                                {price.asString(DECIMALS, Amount.ROUND_UP)} {getAsset(assetA).symbol}
                            </Em>{' '}
                            with estimated{' '}
                            <Em>
                                {amountB.asString(DECIMALS)} {getAsset(assetA).symbol}
                            </Em>
                            .{' '}
                        </p>
                        <p>
                            If the amount of {getAsset(assetB).symbol} used sits outside{' '}
                            <Em>
                                {buffer}% ({new Amount(amountA.muln(1 - buffer)).asString(DECIMALS)}-
                                {new Amount(amountA.muln(1 + buffer)).asString(DECIMALS)} CPAY)
                            </Em>
                            , the transaction will fail.
                        </p>
                        <p>
                            The estimated transaction fee is{' '}
                            <Em>
                                {feeInCpay.asString(DECIMALS, Amount.ROUND_UP)} {getAsset(assetA).symbol}
                            </Em>
                            .
                        </p>
                    </>
                </div>
            );
        case 'sellAsset':
            return (
                <div>
                    <p>Please check over the transaction details below :</p>
                    <>
                        <p>
                            You are buying estimated{' '}
                            <Em>
                                {price.asString(DECIMALS, Amount.ROUND_UP)} {getAsset(assetB).symbol}
                            </Em>{' '}
                            with{' '}
                            <Em>
                                {amountB.asString(DECIMALS)} {getAsset(assetA).symbol}
                            </Em>
                            .{' '}
                        </p>
                        <p>
                            If the amount of {getAsset(assetB).symbol} received sits outside{' '}
                            <Em>
                                {buffer}% ({new Amount(amountA.muln(1 - buffer)).asString(DECIMALS)}-
                                {new Amount(amountA.muln(1 + buffer)).asString(DECIMALS)} CPAY)
                            </Em>
                            , the transaction will fail.
                        </p>
                        <p>
                            The estimated transaction fee is <Em>{feeInCpay.asString(DECIMALS, Amount.ROUND_UP)}</Em>{' '}
                            CPAY.
                        </p>
                    </>
                    {/* <p>You are sending estimated <Em>
                        {price.asString(DECIMALS)} {getAsset(assetB).symbol}
                    </Em> with <Em>{amountB.asString(DECIMALS)} {getAsset(assetA).symbol}</Em> to <Em>{recipientAddress}</Em>.</p>
                    <p>If the amount of CPAY received sits outside <Em>{buffer}% 
                    ({new Amount(amountB.muln(1 - buffer)).asString(DECIMALS)}-{new Amount(amountB.muln(1 + buffer)).asString(DECIMALS)} CPAY)</Em>
                    ,  the transaction will fail.</p>
                    <p>The estimated transation fee is <Em>{feeInCpay.asString(DECIMALS, Amount.ROUND_UP)}</Em> CPAY.</p> */}
                </div>
            );
        default:
            return (
                <div>
                    <p>Please check over the transaction details below :</p>
                    <p>You are withdrawing 42 CENNZ + 42 CPAY.</p>
                    <p>
                        If the amount of CENNZ or CPAY will receive sit outside 3% (40.74 - 43.62 CENNZ, or 40.74 -
                        43.62 CPAY), the transaction will fail.
                    </p>
                    <p>The estimated transation fee is 1.32 CENNZ.</p>
                </div>
            );
    }
};

const BodyForBroadcasted: FC<{txHash: string}> = ({txHash}) => (
    <div>
        It may take a while for this transaction to appear in your wallet. Keep refreshing your transaction history, or
        track the transaction progress by clicking the transaction hash below. <br /> Transaction hash:
        <ExternalLink url={getCennzScanURL(txHash)} text={txHash} />
    </div>
);

type BodyForFinalisedProps = {
    success: boolean;
    events: EventRecord[];
    txHash?: string;
    actualTxFee?: Amount;
    feeExchangeResult?: any;
    extrinsic: IExtrinsic;
};
const BodyForFinalised: FC<BodyForFinalisedProps> = ({
    success,
    txHash,
    events,
    actualTxFee,
    feeExchangeResult,
    extrinsic: {method, params, price},
}) => {
    const [fromAsset, toAsset, amount] = params as AssetSwapParams;
    const [toAssetAmount, fromAssetAmount] =
        method === SWAP_OUTPUT
            ? [amount, price.asString(DECIMALS, Amount.ROUND_UP)]
            : [price, amount.asString(DECIMALS)];
    if (success) {
        return (
            <div>
                You successfully exchanged {toAssetAmount.asString(DECIMALS)} {getAsset(toAsset).symbol} with{' '}
                {fromAssetAmount} {getAsset(fromAsset).symbol}.
                <br />{' '}
                {actualTxFee ? `The transaction fee was ${actualTxFee.asString(DECIMALS, Amount.ROUND_UP)} CPAY ` : ''}
                {feeExchangeResult
                    ? `. with ${feeExchangeResult.amount.asString(DECIMALS, Amount.ROUND_UP)}  ${
                          getAsset(feeExchangeResult.assetId).symbol
                      }`
                    : ''}
                <br /> Transaction hash:
                <ExternalLink url={getCennzScanURL(txHash)} text={txHash} />
            </div>
        );
    } else {
        return (
            <div>
                Your transaction to exchanged {toAssetAmount.asString(DECIMALS)} {getAsset(toAsset).symbol} has failed.
                <br />
                Check transaction hash for more details:
                <ExternalLink url={getCennzScanURL(txHash)} text={txHash} />
            </div>
        );
    }
};

export interface TxDialogBodyProps {
    stage: Stages;
    error?: Error;
    estimatedTxFee: IFee;
    extrinsic: IExtrinsic;
    actualTxFee?: Amount;
    success?: boolean;
    txHash?: string;
    buffer: number;
    recipientAddress: string;
    events: EventRecord[];
    coreAsset: BN;
    feeAssetId: number;
}

export const TxDialogBody: FC<TxDialogBodyProps> = ({
    error,
    stage,
    success,
    extrinsic,
    estimatedTxFee,
    txHash,
    buffer,
    coreAsset,
    events,
    recipientAddress,
    actualTxFee,
    feeAssetId,
}) => {
    const {
        method,
        params: [fromAsset, toAsset, fromAssetAmount, toAssetAmount],
    } = extrinsic;
    switch (stage) {
        case Stages.Signing:
            return error ? (
                <div>{error.message}</div>
            ) : (
                <>
                    <p>Please check over the transaction details below :</p>
                    <SummaryBuy
                        fromAsset={fromAsset}
                        toAsset={toAsset}
                        fromAssetAmount={fromAssetAmount}
                        toAssetAmount={toAssetAmount}
                        buffer={buffer}
                        method={method}
                        recipientAddress={recipientAddress}
                    />
                    <SummaryFee txFee={estimatedTxFee} coreAsset={coreAsset} feeAssetId={feeAssetId} />
                </>
            );
        case Stages.Broadcasted:
            return <BodyForBroadcasted txHash={txHash} />;
        case Stages.Finalised:
            return (
                <BodyForFinalised
                    success={success}
                    events={events}
                    actualTxFee={actualTxFee}
                    txHash={txHash}
                    extrinsic={extrinsic}
                />
            );
        default:
            return <></>;
    }
};
