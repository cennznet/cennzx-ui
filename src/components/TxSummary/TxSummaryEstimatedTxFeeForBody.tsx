import BN from 'bn.js';
import React, {FC} from 'react';
import {DECIMALS} from '../../pages/exchange/exchange';
import {IFee} from '../../typings';
import {getAsset} from '../../util/assets';
import styled from 'styled-components';
import Link from './Link';
import {EMLINK} from 'constants';

export interface TxSummaryEstimatedTxFeeForBodyProps {
    txFee: IFee;
    feeAssetId: number;
    coreAsset: BN;
}

const Em = styled.span`
    color: #1130ff;
    font-weight: 300;
`;

const getFeeMsg = ({txFee, feeAssetId, coreAsset}: TxSummaryEstimatedTxFeeForBodyProps) => {
    let fee;
    const assetSymbol = getAsset(feeAssetId).symbol;

    if (coreAsset.eqn(feeAssetId) && txFee) {
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

const TxSummaryEstimatedTxFeeForBody: FC<TxSummaryEstimatedTxFeeForBodyProps> = props => <div>{getFeeMsg(props)}</div>;

export default TxSummaryEstimatedTxFeeForBody;
