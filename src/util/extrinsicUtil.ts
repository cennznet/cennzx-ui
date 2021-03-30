import {
    AddLiquidityFormData,
    ExchangeFormData,
    IAddLiquidity,
    IRemoveLiquidity,
    LiquidityFormData,
    RemoveLiquidityFormData,
    SendFormData,
} from '../typings';
import {Amount} from './Amount';

export const SWAP_OUTPUT = 'buyAsset';
export const SWAP_INPUT = 'sellAsset';
export const ADD_LIQUIDITY = 'addLiquidity';
export const REMOVE_LIQUIDITY = 'removeLiquidity';
export type liquidityPARAMSOutput = [number, Amount, Amount, Amount];
export type exchangePARAMSOutput = [number, number, Amount, Amount];

export function prepareExchangeExtrinsicParamsWithBuffer(
    extrinsic: string,
    params:
        | Partial<ExchangeFormData>
        | Partial<SendFormData>
        | Partial<LiquidityFormData>
        | Partial<AddLiquidityFormData>
        | Partial<RemoveLiquidityFormData>
): liquidityPARAMSOutput | exchangePARAMSOutput | [] {
    switch (extrinsic) {
        case ADD_LIQUIDITY:
            return [
                (params as LiquidityFormData).assetId,
                (params as LiquidityFormData).coreAssetId,
                (params as LiquidityFormData).coreAmount, // # of pool liquidity shares to mint
                (params as LiquidityFormData).assetAmount, // max asset deposit
            ];
        case REMOVE_LIQUIDITY:
            return [
                (params as LiquidityFormData).assetId,
                (params as LiquidityFormData).coreAssetId,
                (params as LiquidityFormData).coreAmount, // min core amount to withdraw
                (params as LiquidityFormData).assetAmount, // min asset amount to withdraw
            ];
        case SWAP_OUTPUT:
            return [
                (params as ExchangeFormData).fromAsset,
                (params as ExchangeFormData).toAsset,
                (params as ExchangeFormData).fromAssetAmount,
                // new Amount((params as ExchangeFormData).fromAssetAmount.muln(1 + (params as ExchangeFormData).buffer)),
                (params as ExchangeFormData).toAssetAmount,
            ];
        case SWAP_INPUT:
            return [
                (params as ExchangeFormData).fromAsset,
                (params as ExchangeFormData).toAsset,
                (params as ExchangeFormData).fromAssetAmount,
                // new Amount((params as ExchangeFormData).toAssetAmount.muln(1 - (params as ExchangeFormData).buffer)),
                (params as ExchangeFormData).toAssetAmount,
            ];
        default:
            return [];
    }
}

// export function prepareLiquidityParams(
//     extrinsic: string,
//     params: IAddLiquidity | IRemoveLiquidity
//     // addLiquidity: IAddLiquidity,
//     // removeLiquidity: IRemoveLiquidity
// ) {
//     if (extrinsic === ADD_LIQUIDITY) {
//         return [addLiquidity.form.asset as number, addLiquidity.form.investor as string];
//     } else if (extrinsic === REMOVE_LIQUIDITY) {
//         return [removeLiquidity.form.asset as number, removeLiquidity.form.investor as string];
//     } else {
//         return [];
//     }
// }
