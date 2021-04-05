import React, {FC} from 'react';
import styled from 'styled-components';
import {AssetDetails} from '../../redux/reducers/global.reducer';
import {Amount} from '../../util/Amount';
import {ADD_LIQUIDITY, REMOVE_LIQUIDITY, SWAP_INPUT, SWAP_OUTPUT} from '../../util/extrinsicUtil';

type AssetSwapParams = [number, number, Amount, Amount];

//const DECIMALS = 5;

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
    assetInfo: AssetDetails[];
}

const showRecipientAddress = recipientAddress => {
    if (recipientAddress) {
        return (
            <>
                to <Em>{recipientAddress}</Em>
            </>
        );
    }
};

export const SummaryBuy: FC<SummaryBuyProps> = ({
    fromAsset,
    toAsset,
    toAssetAmount,
    fromAssetAmount,
    method,
    buffer,
    recipientAddress,
    assetInfo,
}) => {
    if (!toAssetAmount || !fromAssetAmount) return null;
    switch (method) {
        case SWAP_OUTPUT: {
            const [assetB, assetA, amountB, amountA] = [fromAsset, toAsset, fromAssetAmount, toAssetAmount];
            const assetADecimalPlaces = assetInfo[assetA].decimalPlaces;
            const assetASymbol = assetInfo[assetA].symbol;
            const assetBDecimalPlaces = assetInfo[assetB].decimalPlaces;
            const assetBSymbol = assetInfo[assetB].symbol;
            return (
                <div>
                    <p>
                        You are buying{' '}
                        <Em>
                            {amountA.asString(assetADecimalPlaces, Amount.ROUND_UP)} {assetASymbol}
                        </Em>{' '}
                        with estimated{' '}
                        <Em>
                            {amountB.asString(assetBDecimalPlaces)} {assetBSymbol}
                        </Em>{' '}
                        {showRecipientAddress(recipientAddress)}.{' '}
                    </p>
                    <p>
                        If the amount of {assetBSymbol} used sits outside{' '}
                        <Em>
                            {buffer}% ({new Amount(amountB.muln(1 - buffer)).asString(assetBDecimalPlaces)}-
                            {new Amount(amountB.muln(1 + buffer)).asString(assetBDecimalPlaces)} CPAY)
                        </Em>
                        , the transaction will fail.
                    </p>
                </div>
            );
        }
        case SWAP_INPUT: {
            const [assetB, assetA, amountA, amountB] = [fromAsset, toAsset, toAssetAmount, fromAssetAmount];
            const assetADecimalPlaces = assetInfo[assetA].decimalPlaces;
            const assetASymbol = assetInfo[assetA].symbol;
            const assetBDecimalPlaces = assetInfo[assetB].decimalPlaces;
            const assetBSymbol = assetInfo[assetB].symbol;
            return (
                <div>
                    <p>
                        You are buying estimated{' '}
                        <Em>
                            {amountA.asString(assetADecimalPlaces, Amount.ROUND_UP)} {assetASymbol}
                        </Em>{' '}
                        with{' '}
                        <Em>
                            {amountB.asString(assetBDecimalPlaces)} {assetBSymbol}
                        </Em>{' '}
                        {showRecipientAddress(recipientAddress)}.{' '}
                    </p>
                    <p>
                        If the amount of {assetASymbol} received sits outside{' '}
                        <Em>
                            {buffer}% ({new Amount(amountA.muln(1 - buffer)).asString(assetADecimalPlaces)}-
                            {new Amount(amountA.muln(1 + buffer)).asString(assetADecimalPlaces)} {assetASymbol})
                        </Em>
                        , the transaction will fail.
                    </p>
                </div>
            );
        }

        case REMOVE_LIQUIDITY: {
            const [assetA, assetB, amountA, amountB] = [fromAsset, toAsset, toAssetAmount, fromAssetAmount];
            const assetADecimalPlaces = assetInfo[assetA].decimalPlaces;
            const assetASymbol = assetInfo[assetA].symbol;
            const assetBDecimalPlaces = assetInfo[assetB].decimalPlaces;
            const assetBSymbol = assetInfo[assetB].symbol;
            return (
                <div>
                    <p>
                        You are withdrawing{' '}
                        <Em>
                            {amountA.asString(assetADecimalPlaces, Amount.ROUND_UP)} {assetASymbol}
                        </Em>{' '}
                        +{' '}
                        <Em>
                            {amountB.asString(assetBDecimalPlaces)} {assetBSymbol}
                        </Em>
                        .
                    </p>
                    <p>
                        If the amount of{' '}
                        <Em>
                            {assetASymbol} or {assetBSymbol}
                        </Em>{' '}
                        received sits outside{' '}
                        <Em>
                            {buffer}% ({new Amount(amountA.muln(1 - buffer)).asString(assetADecimalPlaces)}-
                            {new Amount(amountA.muln(1 + buffer)).asString(assetADecimalPlaces)} {assetASymbol}, or{' '}
                            {new Amount(amountB.muln(1 - buffer)).asString(assetBDecimalPlaces)}-
                            {new Amount(amountB.muln(1 + buffer)).asString(assetBDecimalPlaces)} {assetBSymbol})
                        </Em>
                        , the transaction will fail.
                    </p>
                </div>
            );
        }

        case ADD_LIQUIDITY: {
            const [investmentAsset, coreAsset, investmentAmount, coreAmount] = [
                fromAsset,
                toAsset,
                toAssetAmount,
                fromAssetAmount,
            ];
            const investmentAssetDecimalPlaces = assetInfo[investmentAsset].decimalPlaces;
            const investmentAssetSymbol = assetInfo[investmentAsset].symbol;
            const coreAssetDecimalPlaces = assetInfo[coreAsset].decimalPlaces;
            const coreAssetSymbol = assetInfo[coreAsset].symbol;
            return (
                <div>
                    <p>
                        You are depositing{' '}
                        <Em>
                            {investmentAmount.asString(investmentAssetDecimalPlaces, Amount.ROUND_UP)}{' '}
                            {investmentAssetSymbol}
                        </Em>{' '}
                        +{' '}
                        <Em>
                            {coreAmount.asString(coreAssetDecimalPlaces)} {coreAssetSymbol}
                        </Em>
                        .
                    </p>
                    <p>
                        If the amount of{' '}
                        <Em>
                            {investmentAssetSymbol} or {coreAssetSymbol}
                        </Em>{' '}
                        deposited sits outside{' '}
                        <Em>
                            {buffer}% (
                            {new Amount(investmentAmount.muln(1 - buffer)).asString(investmentAssetDecimalPlaces)}-
                            {new Amount(investmentAmount.muln(1 + buffer)).asString(investmentAssetDecimalPlaces)}{' '}
                            {investmentAssetSymbol},{' '}
                            {new Amount(coreAmount.muln(1 - buffer)).asString(coreAssetDecimalPlaces)}-
                            {new Amount(coreAmount.muln(1 + buffer)).asString(coreAssetDecimalPlaces)} {coreAssetSymbol}
                            )
                        </Em>
                        , the transaction will fail.
                    </p>
                </div>
            );
        }
        default:
            return <div></div>;
    }
};
