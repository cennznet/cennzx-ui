import BN from 'bn.js';
import React, {FC} from 'react';
import styled from 'styled-components';
import {DECIMALS} from '../../pages/exchange/exchange';
import {IFee} from '../../typings';
import {getAsset} from '../../util/assets';

export interface SummaryFeeProps {
    txFee: IFee;
    feeAssetId: number;
    coreAssetId: number;
}

const Em = styled.span`
    color: #1130ff;
    font-weight: 300;
`;

const getFeeMsg = ({txFee, feeAssetId, coreAssetId}: SummaryFeeProps) => {
    let fee;
    const assetSymbol = getAsset(feeAssetId).symbol;

    if (coreAssetId && coreAssetId === feeAssetId && txFee) {
        // If fee asset is CPAY use cpayFee
        fee = txFee.feeInCpay.asString(DECIMALS);
        return (
            <>
                Transaction fee (estimated):{' '}
                <Em>
                    {fee} {assetSymbol}
                </Em>
            </>
        );
    } else if (txFee && txFee.feeInFeeAsset) {
        fee = txFee.feeInFeeAsset.asString(DECIMALS);
        return (
            <>
                Transaction fee (estimated):{' '}
                <Em>
                    {fee} {assetSymbol}
                </Em>{' '}
                (converted to ${txFee.feeInCpay.asString(DECIMALS)} CPAY)
            </>
        );
    }
    return (
        <>
            Estimating transaction fee for <Em>{assetSymbol}</Em>
        </>
    );
};

const SummaryFee: FC<SummaryFeeProps> = props => <div>{getFeeMsg(props)}</div>;

export default SummaryFee;
