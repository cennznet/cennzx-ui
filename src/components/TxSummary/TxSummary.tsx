// import BN from 'bn.js';
// import AssetDialog from 'components/TxSummary/AssetDialog';
// import BufferDialog from 'components/TxSummary/BufferDialog/BufferDialog';
// import TxSummaryBodyForBuy from 'components/TxSummary/TxSummaryBodyForBuy';
// import TxSummaryBodyForWith from 'components/TxSummary/TxSummaryBodyForWith';
// import React, {FC, useState} from 'react';
// import styled from 'styled-components';
// import {Asset, IFee} from '../../typings';
// import {Amount} from '../../util/Amount';
// import {SWAP_OUTPUT} from '../../util/extrinsicUtil';
//
// const Parent = styled.div`
//     display: flex;
//     flex-direction: column;
//     margin-top: 20px;
//     background-color: #f8f9f9;
//     padding-left: 24px;
//     padding-right: 24px;
//     padding-bottom: 18px;
//     color: #7f878d;
//     font-family: 'Open Sans', sans-serif;
//     font-size: 14px;
//     margin-bottom: 24px;
// `;
//
// export interface TxSummaryProps {
//     toAssetAmount: Amount;
//     fromAssetAmount: Amount;
//     toAsset: number;
//     fromAsset: number;
//     buffer: number;
//     txFee: IFee;
//     feeAssetId: number;
//     coreAssetId: number;
//     extrinsic: string;
// }
//
// export type TxSummaryBodyForWithAndBodyForBuyProps = Pick<
//     TxSummaryProps,
//     Exclude<keyof TxSummaryProps, 'extrinsic' | 'assets'>
// > & {
//     feeAssetClick: () => void;
//     feeBufferClick: () => void;
// };
//
// type TxSummaryPropsAndEvent = TxSummaryProps & {
//     onAssetChange: (assetId: number) => void;
//     onBufferChange: (buffer: number) => void;
//     assets: Asset[];
// };
//
// const TxSummary: FC<TxSummaryPropsAndEvent> = ({
//     toAssetAmount,
//     fromAssetAmount,
//     toAsset,
//     fromAsset,
//     buffer,
//     txFee,
//     feeAssetId,
//     coreAssetId,
//     extrinsic,
//     assets,
//     onAssetChange,
//     onBufferChange,
// }) => {
//     const [state, setState] = useState({assetDialogOpen: false, bufferDialogOpen: false});
//
//     return (
//         <Parent>
//             <AssetDialog
//                 onClose={() => {
//                     setState({
//                         assetDialogOpen: false,
//                         bufferDialogOpen: state.bufferDialogOpen,
//                     });
//                 }}
//                 isOpen={state.assetDialogOpen}
//                 assetId={feeAssetId}
//                 assets={assets}
//                 onChange={(assetId: number) => {
//                     onAssetChange(assetId);
//                     setState({
//                         assetDialogOpen: false,
//                         bufferDialogOpen: state.bufferDialogOpen,
//                     });
//                 }}
//             />
//
//             <BufferDialog
//                 onClose={() => {
//                     setState({
//                         assetDialogOpen: state.assetDialogOpen,
//                         bufferDialogOpen: false,
//                     });
//                 }}
//                 isOpen={state.bufferDialogOpen}
//                 extrinsic={extrinsic}
//                 buffer={buffer}
//                 assets={assets}
//                 onBufferChange={(buffer: number) => {
//                     onBufferChange(buffer);
//                     setState({
//                         assetDialogOpen: state.assetDialogOpen,
//                         bufferDialogOpen: false,
//                     });
//                 }}
//                 fromAssetAmount={fromAssetAmount}
//                 fromAsset={fromAsset}
//                 toAssetAmount={toAssetAmount}
//                 toAsset={toAsset}
//             />
//
//             <h2>Transaction summary</h2>
//             {extrinsic === SWAP_OUTPUT ? (
//                 <TxSummaryBodyForBuy
//                     feeAssetId={feeAssetId}
//                     coreAssetId={coreAssetId}
//                     txFee={txFee}
//                     toAssetAmount={toAssetAmount}
//                     toAsset={toAsset}
//                     fromAssetAmount={fromAssetAmount}
//                     fromAsset={fromAsset}
//                     buffer={buffer}
//                     feeAssetClick={() => {
//                         setState({
//                             assetDialogOpen: true,
//                             bufferDialogOpen: state.bufferDialogOpen,
//                         });
//                     }}
//                     feeBufferClick={() => {
//                         setState({
//                             assetDialogOpen: state.assetDialogOpen,
//                             bufferDialogOpen: true,
//                         });
//                     }}
//                 />
//             ) : (
//                 <TxSummaryBodyForWith
//                     feeAssetId={feeAssetId}
//                     coreAssetId={coreAssetId}
//                     txFee={txFee}
//                     toAssetAmount={toAssetAmount}
//                     toAsset={toAsset}
//                     fromAssetAmount={fromAssetAmount}
//                     fromAsset={fromAsset}
//                     buffer={buffer}
//                     feeAssetClick={() => {
//                         setState({
//                             assetDialogOpen: true,
//                             bufferDialogOpen: state.bufferDialogOpen,
//                         });
//                     }}
//                     feeBufferClick={() => {
//                         setState({
//                             assetDialogOpen: state.assetDialogOpen,
//                             bufferDialogOpen: true,
//                         });
//                     }}
//                 />
//             )}
//         </Parent>
//     );
// };
//
// export default TxSummary;
