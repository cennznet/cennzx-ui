import {EventRecord} from '@cennznet/types';
import BN from 'bn.js';
import ExternalLink from 'components/ExternalLink';
import TxSummaryEstimatedTxFeeForBody from 'components/TxSummary/TxSummaryEstimatedTxFeeForBody';
import React, {FC, useState} from 'react';
import {AssetDetails} from '../../../redux/reducers/global.reducer';
import {Stages} from '../../../redux/reducers/ui/txDialog.reducer';
import {IExtrinsic, IFee} from '../../../typings';
import {Amount} from '../../../util/Amount';
import {ADD_LIQUIDITY, REMOVE_LIQUIDITY, SWAP_INPUT, SWAP_OUTPUT} from '../../../util/extrinsicUtil';
import {SummaryBuy} from '../../AdvancedSetting/SummaryBuy';
import SummaryFee from '../../AdvancedSetting/SummaryFee';

type AssetSwapParams = [number, number, Amount, Amount];

const getCennzScanURL = txHash => `https://www.uncoverexplorer.com/extrinsic/${txHash}`;

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
    assetInfo: AssetDetails[];
};
const BodyForFinalised: FC<BodyForFinalisedProps> = ({
    success,
    txHash,
    events,
    actualTxFee,
    feeExchangeResult,
    extrinsic: {method, params, price},
    assetInfo,
}) => {
    const [fromAsset, toAsset, fromAssetAmount, toAssetAmount] = params as AssetSwapParams;
    const toAssetDecimalPlaces = assetInfo[toAsset].decimalPlaces;
    const toAssetSymbol = assetInfo[toAsset].symbol;
    const fromAssetDecimalPlaces = assetInfo[fromAsset].decimalPlaces;
    const fromAssetSymbol = assetInfo[fromAsset].symbol;

    let message;
    if (success) {
        switch (method) {
            case SWAP_OUTPUT:
                message = `You successfully exchanged ${toAssetAmount.asString(
                    toAssetDecimalPlaces
                )} ${toAssetSymbol} with 
                    ${fromAssetAmount.asString(fromAssetDecimalPlaces)} ${fromAssetSymbol}.`;
                break;
            case SWAP_INPUT:
                message = `You successfully exchanged ${toAssetAmount.asString(
                    toAssetDecimalPlaces
                )} ${toAssetSymbol} with 
                    ${fromAssetAmount.asString(fromAssetDecimalPlaces)} ${fromAssetSymbol}.`;
                break;
            case ADD_LIQUIDITY:
                message = `You successfully added ${toAssetAmount.asString(
                    fromAssetDecimalPlaces
                )} ${fromAssetSymbol} and
                    ${fromAssetAmount.asString(toAssetDecimalPlaces)} ${toAssetSymbol} in the pool.`;
                break;
            case REMOVE_LIQUIDITY:
                message = `You successfully withdraw ${toAssetAmount.asString(
                    fromAssetDecimalPlaces
                )} ${fromAssetSymbol} and
                    ${fromAssetAmount.asString(toAssetDecimalPlaces)} ${toAssetSymbol} from the pool.`;
                break;
            default:
                message = '';
        }
    } else {
        switch (method) {
            case SWAP_OUTPUT:
                message = `Your transaction to exchange ${toAssetAmount.asString(
                    toAssetDecimalPlaces
                )} ${toAssetSymbol} with 
                    ${fromAssetAmount.asString(assetInfo[fromAsset].decimalPlaces)} ${fromAssetSymbol} has failed.`;
                break;
            case SWAP_INPUT:
                message = `Your transaction to exchange  ${toAssetAmount.asString(
                    toAssetDecimalPlaces
                )} ${toAssetSymbol} with 
                    ${fromAssetAmount.asString(assetInfo[fromAsset].decimalPlaces)} ${fromAssetSymbol} has failed.`;
                break;
            case ADD_LIQUIDITY:
                message = `Your transaction to add liquidity of ${toAssetAmount.asString(
                    toAssetDecimalPlaces
                )} ${fromAssetSymbol} and
                    ${fromAssetAmount.asString(
                        assetInfo[fromAsset].decimalPlaces
                    )} ${toAssetSymbol} in the pool failed.`;
                break;
            case REMOVE_LIQUIDITY:
                message = `Your transaction to withdraw liquidity of ${toAssetAmount.asString(
                    toAssetDecimalPlaces
                )} ${fromAssetSymbol} and
                    ${fromAssetAmount.asString(
                        assetInfo[fromAsset].decimalPlaces
                    )} ${toAssetSymbol} from the pool failed.`;
                break;
            default:
                message = '';
                break;
        }
    }
    if (success) {
        return (
            <div>
                {message}
                <br />{' '}
                {actualTxFee
                    ? `The transaction fee was ${actualTxFee.asString(
                          assetInfo[16001].decimalPlaces,
                          Amount.ROUND_UP
                      )} CPAY `
                    : ''}
                {feeExchangeResult
                    ? `. with ${feeExchangeResult.amount.asString(assetInfo[16001].decimalPlaces, Amount.ROUND_UP)}  ${
                          assetInfo[feeExchangeResult.assetId].symbol
                      }`
                    : ''}
                <br /> Transaction hash:
                <ExternalLink url={getCennzScanURL(txHash)} text={txHash} />
            </div>
        );
    } else {
        return (
            <div>
                {message}.
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
    coreAssetId: number;
    feeAssetId: number;
    assetInfo: [];
}

export const TxDialogBody: FC<TxDialogBodyProps> = ({
    error,
    stage,
    success,
    extrinsic,
    estimatedTxFee,
    txHash,
    buffer,
    coreAssetId,
    events,
    recipientAddress,
    actualTxFee,
    feeAssetId,
    assetInfo,
}) => {
    if (extrinsic === null || extrinsic === undefined) {
        return null;
    }
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
                        assetInfo={assetInfo}
                    />
                    <SummaryFee
                        txFee={estimatedTxFee}
                        coreAssetId={coreAssetId}
                        feeAssetId={feeAssetId}
                        assetInfo={assetInfo}
                    />
                </>
            );
        case Stages.InBlock:
            return <BodyForBroadcasted txHash={txHash} />;
        case Stages.Finalised:
            return (
                <BodyForFinalised
                    success={success}
                    events={events}
                    actualTxFee={actualTxFee}
                    txHash={txHash}
                    extrinsic={extrinsic}
                    assetInfo={assetInfo}
                />
            );
        default:
            return <></>;
    }
};
