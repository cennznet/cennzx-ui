import {ExchangeFormData, IExchangePool} from '../typings';
import {Amount} from './Amount';

export const ROUND_UP = 1;

// If liquidity = total user's liquidity then the output is user's total core and asset share in the pool
export function getAssetToWithdraw(liquidity: Amount, poolBalance: IExchangePool, totalLiquidity: Amount) {
    const coreReserve = poolBalance.coreAssetBalance;
    const assetReserve = poolBalance.assetBalance;
    if (liquidity.gt(totalLiquidity)) {
        throw new Error('Tried to overdraw liquidity');
    }
    const coreAmount = liquidity.mul(coreReserve).div(totalLiquidity);
    const assetAmount = liquidity.mul(assetReserve).div(totalLiquidity);
    return {coreAmount, assetAmount};
}

export function getAssetFromCore(coreAmount: Amount, poolBalance: IExchangePool) {
    const coreReserve = poolBalance.coreAssetBalance;
    const assetReserve = poolBalance.assetBalance;
    if (coreReserve.isZero() || assetReserve.isZero()) {
        return coreAmount;
    } else {
        return coreAmount
            .mul(assetReserve)
            .div(coreReserve)
            .addn(ROUND_UP);
    }
}

export function getCoreFromAsset(assetAmount: Amount, poolBalance: IExchangePool, buffer: number) {
    const coreReserve = poolBalance.coreAssetBalance;
    const assetReserve = poolBalance.assetBalance;
    if (coreReserve.isZero() || assetReserve.isZero()) {
        return assetAmount;
    } else {
        // Formula goes asset_amount = core_amount * asset_reserve/ core_reserve + 1
        return assetAmount
            .mul(coreReserve)
            .div(assetReserve)
            .subn(ROUND_UP);
        //.muln(1 - buffer) ~ not sure if we need buffer here as this is the exact amount going to the pool.
    }
}

export function poolShare(userLiquidity: Amount, totalLiquidity: Amount, amount: Amount) {
    return amount.mul(userLiquidity).div(totalLiquidity);
}
