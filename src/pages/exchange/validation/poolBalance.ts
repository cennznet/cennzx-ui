import {PoolBalanceNotEnough, UnknownFormError} from '../../../error/error';
import {Amount} from '../../../util/Amount';
import {SWAP_OUTPUT} from '../../../util/extrinsicUtil';
import {ExchangeProps, FormSection} from '../exchange';
import {existErrors, FormErrors, mergeError} from './index';

function checkPoolBalance(props: ExchangeProps, errors: FormErrors): void {
    const {
        form: {toAssetAmount, toAsset},
        outputReserve,
        assetInfo,
    } = props;
    if (toAssetAmount && outputReserve && toAssetAmount.gt(outputReserve)) {
        mergeError(
            FormSection.toAssetInput,
            new PoolBalanceNotEnough(assetInfo[toAsset], toAssetAmount, outputReserve),
            errors
        );
    }
}

function checkPoolBalanceWhenAssetToAsset(props: ExchangeProps, errors: FormErrors): void {
    const {
        form: {toAssetAmount, toAsset, fromAsset, extrinsic},
        coreAsset,
        feeRate,
        exchangePool,
    } = props;
    // skip when it's not asset to asset trade
    if (coreAsset && fromAsset && toAsset && (coreAsset.eqn(fromAsset) || coreAsset.eqn(toAsset))) return;
    // skip when toAsset's pool has `PoolBalanceNotEnough`
    if (existErrors('PoolBalanceNotEnough', errors, FormSection.toAssetInput)) return;

    const assetToReserve = exchangePool.find(poolData => poolData.assetId === toAsset);
    const assetFromReserve = exchangePool.find(poolData => poolData.assetId === fromAsset);
    if (extrinsic === SWAP_OUTPUT && assetFromReserve && assetToReserve) {
        // try {
        //     const coreForB = getOutputPrice(
        //         toAssetAmount,
        //         assetFromReserve.coreAssetBalance,
        //         assetFromReserve.assetBalance,
        //         feeRate
        //     );
        //     if (coreForB.gt(assetToReserve.coreAssetBalance)) {
        //         mergeError(
        //             FormSection.form,
        //             new PoolBalanceNotEnough(
        //                 getAsset(fromAsset),
        //                 new Amount(coreForB),
        //                 assetToReserve.coreAssetBalance
        //             ),
        //             errors
        //         );
        //     }
        // } catch (e) {
        mergeError(FormSection.form, new UnknownFormError(e), errors);
        // }
    }
}

/**
 * priorities:
 * checkPoolBalance > checkPoolBalanceWhenAssetToAsset
 */
export default [checkPoolBalance, checkPoolBalanceWhenAssetToAsset];
