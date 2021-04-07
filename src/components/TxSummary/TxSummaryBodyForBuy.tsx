// import React, {FC} from 'react';
// import styled from 'styled-components';
// import {DECIMALS} from '../../pages/exchange/exchange';
// import {Amount} from '../../util/Amount';
// import {getAsset} from '../../util/assets';
// import Link from './Link';
// import {TxSummaryBodyForWithAndBodyForBuyProps} from './TxSummary';
// import TxSummaryEstimatedTxFeeForBody from './TxSummaryEstimatedTxFeeForBody';
//
// const Em = styled.span`
//     color: #1130ff;
//     font-weight: 600;
// `;
//
// const TxSummaryBodyForBuy: FC<TxSummaryBodyForWithAndBodyForBuyProps> = ({
//     toAssetAmount,
//     fromAssetAmount,
//     toAsset,
//     fromAsset,
//     buffer,
//     txFee,
//     feeAssetId,
//     coreAssetId,
//     feeAssetClick,
//     feeBufferClick,
// }) => (
//     <div>
//         You are exchanging{' '}
//         <Em>
//             {toAssetAmount.asString(DECIMALS)} {getAsset(toAsset).symbol}
//         </Em>{' '}
//         with an estimated{' '}
//         <Em>
//             {fromAssetAmount.asString(DECIMALS)} {getAsset(fromAsset).symbol}
//         </Em>
//         <br />
//         If the amount of {getAsset(toAsset).symbol} you are spending goes over (
//         <Em>
//             {buffer}% {new Amount(fromAssetAmount.muln(1 + buffer)).asString(DECIMALS)} {getAsset(fromAsset).symbol}
//         </Em>
//         ) then the transaction will fail
//         <TxSummaryEstimatedTxFeeForBody txFee={txFee} coreAssetId={coreAssetId} feeAssetId={feeAssetId} />
//     </div>
// );
//
// export default TxSummaryBodyForBuy;
