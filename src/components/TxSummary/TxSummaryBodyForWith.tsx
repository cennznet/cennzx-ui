import React, {FC} from 'react';
import {DECIMALS} from '../../pages/exchange/exchange';
import {Amount} from '../../util/Amount';
import {getAsset} from '../../util/assets';
import Link from './Link';
import {TxSummaryBodyForWithAndBodyForBuyProps} from './TxSummary';
import TxSummaryEstimatedTxFeeForBody from './TxSummaryEstimatedTxFeeForBody';

const TxSummaryBodyForWith: FC<TxSummaryBodyForWithAndBodyForBuyProps> = ({
    toAssetAmount,
    fromAssetAmount,
    toAsset,
    fromAsset,
    buffer,
    txFee,
    feeAssetId,
    coreAssetId,
    feeAssetClick,
    feeBufferClick,
}) => (
    <div>
        You are buying an estimated {fromAssetAmount.asString(DECIMALS)} {getAsset(fromAsset).symbol} with{' '}
        {toAssetAmount.asString(DECIMALS)} {getAsset(toAsset).symbol} <br />
        If the amount of {getAsset(fromAsset).symbol} you are buying falls below{' '}
        <Link onClick={feeBufferClick}>
            ({buffer}% {new Amount(toAssetAmount.muln(1 - buffer)).asString(DECIMALS)} {getAsset(toAsset).symbol})
        </Link>{' '}
        then the transaction will fail
        <TxSummaryEstimatedTxFeeForBody txFee={txFee} coreAssetId={coreAssetId} feeAssetId={feeAssetId} />
    </div>
);

export default TxSummaryBodyForWith;
