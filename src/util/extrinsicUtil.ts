import {
    AddLiquidityFormData,
    ExchangeFormData,
    SendFormData,
    LiquidityFormData,
    IAddLiquidity,
    IRemoveLiquidity,
    RemoveLiquidityFormData,
} from '../typings';
import {Amount} from './Amount';

export const SWAP_OUTPUT = 'buyAsset';
export const SWAP_INPUT = 'sellAsset';
export const ADD_LIQUIDITY = 'addLiquidity';
export const REMOVE_LIQUIDITY = 'removeLiquidity';
export type liquidityPARAMSOutput = [number, string];
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
            return [params.fromAsset, params.toAsset, params.fromAssetAmount, params.toAssetAmount];
        case REMOVE_LIQUIDITY:
            return [params.fromAsset, params.toAsset, params.fromAssetAmount, params.toAssetAmount];
        case SWAP_OUTPUT:
            return [
                (params as ExchangeFormData).fromAsset,
                (params as ExchangeFormData).toAsset,
                (params as ExchangeFormData).toAssetAmount,
                new Amount((params as ExchangeFormData).fromAssetAmount.muln(1 + (params as ExchangeFormData).buffer)),
            ];
        case SWAP_INPUT:
            return [
                (params as ExchangeFormData).fromAsset,
                (params as ExchangeFormData).toAsset,
                (params as ExchangeFormData).fromAssetAmount,
                new Amount((params as ExchangeFormData).toAssetAmount.muln(1 - (params as ExchangeFormData).buffer)),
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
