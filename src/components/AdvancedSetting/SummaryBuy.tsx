import React, {FC} from 'react';
import {Amount} from '../../util/Amount';
import {getAsset} from '../../util/assets';
import {SWAP_OUTPUT} from '../../util/extrinsicUtil';
import styled from 'styled-components';

type AssetSwapParams = [number, number, Amount, Amount];

const DECIMALS = 5;

const Em = styled.span`
    color: #1130ff;
`;

export interface SummaryBuyProps {
    fromAsset: number;
    toAsset: number;
    fromAssetAmount: Amount;
    toAssetAmount: Amount;
    method: string;
    buffer: number;
    recipientAddress?: string;
}

const showRecipientAddress = recipientAddress => {
    if (recipientAddress)
        return (
            <>
                to <Em>{recipientAddress}</Em>
            </>
        );
};

export const SummaryBuy: FC<SummaryBuyProps> = ({
    fromAsset,
    toAsset,
    toAssetAmount,
    fromAssetAmount,
    method,
    buffer,
    recipientAddress,
}) => {
    const [assetB, assetA, amountA, amountB] =
        method === SWAP_OUTPUT
            ? [fromAsset, toAsset, toAssetAmount, fromAssetAmount]
            : [fromAsset, toAsset, toAssetAmount, fromAssetAmount];
    if (!amountA || !amountB) return null;
    switch (method) {
        case 'buyAsset':
            return (
                <div>
                    <p>
                        You are buying{' '}
                        <Em>
                            {amountA.asString(DECIMALS, Amount.ROUND_UP)} {getAsset(assetA).symbol}
                        </Em>{' '}
                        with estimated{' '}
                        <Em>
                            {amountB.asString(DECIMALS)} {getAsset(assetB).symbol}
                        </Em>{' '}
                        {showRecipientAddress(recipientAddress)}.{' '}
                    </p>
                    <p>
                        If the amount of {getAsset(assetB).symbol} used sits outside{' '}
                        <Em>
                            {buffer}% ({new Amount(amountA.muln(1 - buffer)).asString(DECIMALS)}-
                            {new Amount(amountA.muln(1 + buffer)).asString(DECIMALS)} CPAY)
                        </Em>
                        , the transaction will fail.
                    </p>
                </div>
            );
        case 'sellAsset':
            return (
                <div>
                    <p>
                        You are buying estimated{' '}
                        <Em>
                            {amountA.asString(DECIMALS, Amount.ROUND_UP)} {getAsset(assetA).symbol}
                        </Em>{' '}
                        with{' '}
                        <Em>
                            {amountB.asString(DECIMALS)} {getAsset(assetB).symbol}
                        </Em>{' '}
                        {showRecipientAddress(recipientAddress)}.{' '}
                    </p>
                    <p>
                        If the amount of {getAsset(assetA).symbol} received sits outside{' '}
                        <Em>
                            {buffer}% ({new Amount(amountA.muln(1 - buffer)).asString(DECIMALS)}-
                            {new Amount(amountA.muln(1 + buffer)).asString(DECIMALS)} {getAsset(assetA).symbol})
                        </Em>
                        , the transaction will fail.
                    </p>
                </div>
            );

        case 'remove':
            return (
                <div>
                    <p>
                        You are withdrawing{' '}
                        <Em>
                            {amountA.asString(DECIMALS, Amount.ROUND_UP)} {getAsset(assetA).symbol}
                        </Em>{' '}
                        +{' '}
                        <Em>
                            {amountB.asString(DECIMALS)} {getAsset(assetB).symbol}
                        </Em>
                        .
                    </p>
                    <p>
                        If the amount of{' '}
                        <Em>
                            {getAsset(assetA).symbol} or {getAsset(assetB).symbol}
                        </Em>{' '}
                        received sits outside{' '}
                        <Em>
                            {buffer}% ({new Amount(amountA.muln(1 - buffer)).asString(DECIMALS)}-
                            {new Amount(amountA.muln(1 + buffer)).asString(DECIMALS)} {getAsset(assetA).symbol}, or{' '}
                            {new Amount(amountB.muln(1 - buffer)).asString(DECIMALS)}-
                            {new Amount(amountB.muln(1 + buffer)).asString(DECIMALS)} {getAsset(assetB).symbol})
                        </Em>
                        , the transaction will fail.
                    </p>
                </div>
            );

        case 'add':
            return (
                <div>
                    <p>
                        You are depositing{' '}
                        <Em>
                            {amountA.asString(DECIMALS, Amount.ROUND_UP)} {getAsset(assetA).symbol}
                        </Em>{' '}
                        +{' '}
                        <Em>
                            {amountB.asString(DECIMALS)} {getAsset(assetB).symbol}
                        </Em>
                        .
                    </p>
                    <p>
                        If the amount of{' '}
                        <Em>
                            {getAsset(assetA).symbol} or {getAsset(assetB).symbol}
                        </Em>{' '}
                        deposited sits outside{' '}
                        <Em>
                            {buffer}% ({new Amount(amountA.muln(1 - buffer)).asString(DECIMALS)}-
                            {new Amount(amountA.muln(1 + buffer)).asString(DECIMALS)} {getAsset(assetA).symbol},{' '}
                            {new Amount(amountB.muln(1 - buffer)).asString(DECIMALS)}-
                            {new Amount(amountB.muln(1 + buffer)).asString(DECIMALS)} {getAsset(assetB).symbol})
                        </Em>
                        , the transaction will fail.
                    </p>
                </div>
            );
        default:
            return <div></div>;
    }
};
