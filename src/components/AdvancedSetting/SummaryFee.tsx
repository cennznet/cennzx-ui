import BN from 'bn.js';
import React, {FC} from 'react';
import styled from 'styled-components';
import {AssetDetails} from '../../redux/reducers/global.reducer';
import {IFee} from '../../typings';

export interface SummaryFeeProps {
    txFee: IFee | undefined;
    feeAssetId: number | undefined;
    coreAssetId: number;
    assetInfo: AssetDetails[];
}

const Em = styled.span`
    color: #1130ff;
    font-weight: 300;
`;

const getFeeMsg = ({txFee, feeAssetId, coreAssetId, assetInfo}: SummaryFeeProps) => {
    let fee;
    const assetSymbol = assetInfo[feeAssetId as number].symbol;

    if (coreAssetId && coreAssetId === feeAssetId && txFee) {
        // If fee asset is CPAY use cpayFee
        fee = txFee.feeInCpay.asString(assetInfo[coreAssetId].decimalPlaces);
        return (
            <>
                Transaction fee (estimated):{' '}
                <Em>
                    {fee} {assetSymbol}
                </Em>
            </>
        );
    } else if (txFee && txFee.feeInFeeAsset) {
        fee = txFee.feeInFeeAsset.asString(assetInfo[feeAssetId as number].decimalPlaces);
        return (
            <>
                Transaction fee (estimated):{' '}
                <Em>
                    {fee} {assetSymbol}
                </Em>{' '}
                (converted to ${txFee.feeInCpay.asString(assetInfo[coreAssetId].decimalPlaces)} CPAY)
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
