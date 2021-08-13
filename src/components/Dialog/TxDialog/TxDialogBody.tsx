import {EventRecord} from '@cennznet/types';
import BN from 'bn.js';
import React, {FC, useState} from 'react';
import {AssetDetails} from '../../../redux/reducers/global.reducer';
import {Stages} from '../../../redux/reducers/ui/txDialog.reducer';
import {IExtrinsic, IFee} from '../../../typings';
import {Amount} from '../../../util/Amount';
import {ADD_LIQUIDITY, REMOVE_LIQUIDITY, SWAP_INPUT, SWAP_OUTPUT} from '../../../util/extrinsicUtil';
import {SummaryBuy} from '../../AdvancedSetting/SummaryBuy';
import SummaryFee from '../../AdvancedSetting/SummaryFee';
import ExternalLink from '../../ExternalLink';

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
    feeAssetId: number;
};
const BodyForFinalised: FC<BodyForFinalisedProps> = ({
    success,
    txHash,
    events,
    actualTxFee,
    feeExchangeResult,
    extrinsic: {method, params, price},
    assetInfo,
    feeAssetId,
}) => {
    let message;
    if (method === SWAP_INPUT || method === SWAP_OUTPUT) {
        const [fromAsset, toAsset, fromAssetAmount, toAssetAmount] = params as AssetSwapParams;
        const toAssetDecimalPlaces = assetInfo[toAsset].decimalPlaces;
        const toAssetSymbol = assetInfo[toAsset].symbol;
        const fromAssetDecimalPlaces = assetInfo[fromAsset].decimalPlaces;
        const fromAssetSymbol = assetInfo[fromAsset].symbol;
        if (success) {
            message = `You successfully exchanged ${toAssetAmount.asString(toAssetDecimalPlaces)} ${toAssetSymbol} with 
                    ${fromAssetAmount.asString(fromAssetDecimalPlaces)} ${fromAssetSymbol}.`;
        } else {
            message = `Your transaction to exchange ${toAssetAmount.asString(
                toAssetDecimalPlaces
            )} ${toAssetSymbol} with 
                    ${fromAssetAmount.asString(fromAssetDecimalPlaces)} ${fromAssetSymbol} has failed.`;
        }
    } else if (method === ADD_LIQUIDITY || method === REMOVE_LIQUIDITY) {
        const [assetId, coreAssetId, coreAmount, assetAmount] = params as AssetSwapParams;
        const coreAssetDecimalPlaces = assetInfo[coreAssetId].decimalPlaces;
        const coreAssetSymbol = assetInfo[coreAssetId].symbol;
        const assetDecimalPlaces = assetInfo[assetId].decimalPlaces;
        const assetSymbol = assetInfo[assetId].symbol;
        const place = method === ADD_LIQUIDITY ? 'in' : 'from';
        if (success) {
            const action = method === ADD_LIQUIDITY ? 'added' : 'withdrew';
            message = `You successfully ${action} ${assetAmount.asString(assetDecimalPlaces)} ${assetSymbol} and
                    ${coreAmount.asString(coreAssetDecimalPlaces)} ${coreAssetSymbol} ${place} the pool.`;
        } else {
            const action = method === ADD_LIQUIDITY ? 'add' : 'withdraw';
            message = `Your transaction to ${action} liquidity of ${assetAmount.asString(
                assetDecimalPlaces
            )} ${assetSymbol} and
                    ${coreAmount.asString(coreAssetDecimalPlaces)} ${coreAssetSymbol} ${place} the pool failed.`;
        }
    }

    if (success) {
        return (
            <div>
                {message}
                <br />{' '}
                {actualTxFee
                    ? `The transaction fee was ${actualTxFee.asString(
                          assetInfo[feeAssetId].decimalPlaces,
                          Amount.ROUND_UP
                      )} CPAY `
                    : ''}
                {feeExchangeResult
                    ? `. with ${feeExchangeResult.amount.asString(
                          assetInfo[feeAssetId].decimalPlaces,
                          Amount.ROUND_UP
                      )}  ${assetInfo[feeExchangeResult.assetId].symbol}`
                    : ''}
                <br /> Transaction hash:
                <ExternalLink url={getCennzScanURL(txHash)} text={txHash as string} />
            </div>
        );
    } else {
        return (
            <div>
                {message}.
                <br />
                Check transaction hash for more details:
                <ExternalLink url={getCennzScanURL(txHash)} text={txHash as string} />
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
            return <BodyForBroadcasted txHash={txHash as string} />;
        case Stages.Finalised:
            return (
                <BodyForFinalised
                    success={success as boolean}
                    events={events}
                    actualTxFee={actualTxFee}
                    txHash={txHash}
                    extrinsic={extrinsic}
                    assetInfo={assetInfo}
                    feeAssetId={feeAssetId}
                />
            );
        default:
            return <></>;
    }
};
