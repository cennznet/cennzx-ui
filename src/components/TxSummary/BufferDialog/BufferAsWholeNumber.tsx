// import React, {FC} from 'react';
// import styled from 'styled-components';
// import {DECIMALS} from '../../../pages/exchange/exchange';
// import {Amount} from '../../../util/Amount';
// import {getAsset} from '../../../util/assets';
// import {SWAP_OUTPUT} from '../../../util/extrinsicUtil';
//
// const WholeNumber = styled.div`
//     color: #7f878d;
//     font-family: 'Open Sans', sans-serif;
//     font-size: 14px;
//     margin-top: 6px;
//     white-space: nowrap;
// `;
//
// interface BufferAsWholeNumberProps {
//     fromAssetAmount: Amount;
//     fromAsset: number;
//     toAssetAmount: Amount;
//     toAsset: number;
//     buffer: number;
//     extrinsic: string;
// }
// const BufferAsWholeNumber: FC<BufferAsWholeNumberProps> = ({
//     fromAssetAmount,
//     fromAsset,
//     toAssetAmount,
//     toAsset,
//     extrinsic,
//     buffer,
// }) => (
//     <WholeNumber>
//         ={' '}
//         {extrinsic === SWAP_OUTPUT
//             ? new Amount(fromAssetAmount.muln(1 + buffer)).asString(DECIMALS)
//             : new Amount(toAssetAmount.muln(1 - buffer)).asString(DECIMALS)}{' '}
//         {extrinsic === SWAP_OUTPUT ? getAsset(fromAsset).symbol : getAsset(toAsset).symbol}
//     </WholeNumber>
// );
//
// export default BufferAsWholeNumber;
