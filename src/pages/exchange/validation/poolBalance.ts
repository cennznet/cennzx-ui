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

/**
 * priorities:
 * checkPoolBalance
 */
export default [checkPoolBalance];
