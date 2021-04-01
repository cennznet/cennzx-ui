import React, {FC} from 'react';
import styled from 'styled-components';
import {AssetDetails} from '../../redux/reducers/global.reducer';
import {Amount} from '../../util/Amount';
import {getAsset} from '../../util/assets';
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
            return (
                <div>
                    <p>
                        You are buying{' '}
                        <Em>
                            {amountA.asString(assetInfo[assetA].decimalPlaces, Amount.ROUND_UP)}{' '}
                            {getAsset(assetA).symbol}
                        </Em>{' '}
                        with estimated{' '}
                        <Em>
                            {amountB.asString(assetInfo[assetB].decimalPlaces)} {getAsset(assetB).symbol}
                        </Em>{' '}
                        {showRecipientAddress(recipientAddress)}.{' '}
                    </p>
                    <p>
                        If the amount of {getAsset(assetB).symbol} used sits outside{' '}
                        <Em>
                            {buffer}% ({new Amount(amountB.muln(1 - buffer)).asString(assetInfo[assetB].decimalPlaces)}-
                            {new Amount(amountB.muln(1 + buffer)).asString(assetInfo[assetB].decimalPlaces)} CPAY)
                        </Em>
                        , the transaction will fail.
                    </p>
                </div>
            );
        }
        case SWAP_INPUT: {
            const [assetB, assetA, amountA, amountB] = [fromAsset, toAsset, toAssetAmount, fromAssetAmount];
            return (
                <div>
                    <p>
                        You are buying estimated{' '}
                        <Em>
                            {amountA.asString(assetInfo[assetA].decimalPlaces, Amount.ROUND_UP)}{' '}
                            {getAsset(assetA).symbol}
                        </Em>{' '}
                        with{' '}
                        <Em>
                            {amountB.asString(assetInfo[assetB].decimalPlaces)} {getAsset(assetB).symbol}
                        </Em>{' '}
                        {showRecipientAddress(recipientAddress)}.{' '}
                    </p>
                    <p>
                        If the amount of {getAsset(assetA).symbol} received sits outside{' '}
                        <Em>
                            {buffer}% ({new Amount(amountA.muln(1 - buffer)).asString(assetInfo[assetA].decimalPlaces)}-
                            {new Amount(amountA.muln(1 + buffer)).asString(assetInfo[assetA].decimalPlaces)}{' '}
                            {getAsset(assetA).symbol})
                        </Em>
                        , the transaction will fail.
                    </p>
                </div>
            );
        }

        case REMOVE_LIQUIDITY: {
            const [assetA, assetB, amountA, amountB] = [fromAsset, toAsset, toAssetAmount, fromAssetAmount];
            return (
                <div>
                    <p>
                        You are withdrawing{' '}
                        <Em>
                            {amountA.asString(assetInfo[assetA].decimalPlaces, Amount.ROUND_UP)}{' '}
                            {getAsset(assetA).symbol}
                        </Em>{' '}
                        +{' '}
                        <Em>
                            {amountB.asString(assetInfo[assetB].decimalPlaces)} {getAsset(assetB).symbol}
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
                            {buffer}% ({new Amount(amountA.muln(1 - buffer)).asString(assetInfo[assetA].decimalPlaces)}-
                            {new Amount(amountA.muln(1 + buffer)).asString(assetInfo[assetA].decimalPlaces)}{' '}
                            {getAsset(assetA).symbol}, or{' '}
                            {new Amount(amountB.muln(1 - buffer)).asString(assetInfo[assetB].decimalPlaces)}-
                            {new Amount(amountB.muln(1 + buffer)).asString(assetInfo[assetB].decimalPlaces)}{' '}
                            {getAsset(assetB).symbol})
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
            return (
                <div>
                    <p>
                        You are depositing{' '}
                        <Em>
                            {investmentAmount.asString(assetInfo[investmentAsset].decimalPlaces, Amount.ROUND_UP)}{' '}
                            {getAsset(investmentAsset).symbol}
                        </Em>{' '}
                        +{' '}
                        <Em>
                            {coreAmount.asString(assetInfo[coreAsset].decimalPlaces)} {getAsset(coreAsset).symbol}
                        </Em>
                        .
                    </p>
                    <p>
                        If the amount of{' '}
                        <Em>
                            {getAsset(investmentAsset).symbol} or {getAsset(coreAsset).symbol}
                        </Em>{' '}
                        deposited sits outside{' '}
                        <Em>
                            {buffer}% (
                            {new Amount(investmentAmount.muln(1 - buffer)).asString(
                                assetInfo[investmentAsset].decimalPlaces
                            )}
                            -
                            {new Amount(investmentAmount.muln(1 + buffer)).asString(
                                assetInfo[investmentAsset].decimalPlaces
                            )}{' '}
                            {getAsset(investmentAsset).symbol},{' '}
                            {new Amount(coreAmount.muln(1 - buffer)).asString(assetInfo[coreAsset].decimalPlaces)}-
                            {new Amount(coreAmount.muln(1 + buffer)).asString(assetInfo[coreAsset].decimalPlaces)}{' '}
                            {getAsset(coreAsset).symbol})
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
