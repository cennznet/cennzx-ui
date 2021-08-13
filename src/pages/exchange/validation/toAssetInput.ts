import {FieldNotReady, ToAssetAmountRequired, ToAssetNotSelected} from '../../../error/error';
import {ExchangeProps, FormSection} from '../exchange';
import {existErrors, FormErrors, mergeError} from './index';

function checkToAssetAmount(props: ExchangeProps, errors: FormErrors): void {
    if (existErrors(['PoolBalanceNotEnough', 'ToAssetNotSelected'], errors)) {
        return;
    }
    const {
        form: {toAssetAmount, fromAssetAmount, toAsset},
        assetInfo,
    } = props;
    if (!toAssetAmount) {
        if (fromAssetAmount) {
            mergeError(FormSection.toAssetInput, new FieldNotReady(FormSection.toAssetInput), errors);
        } else {
            mergeError(
                FormSection.toAssetInput,
                new ToAssetAmountRequired(assetInfo[toAsset as number].symbol),
                errors
            );
        }
    }
}

function checkToAssetDropdown(props: ExchangeProps, errors: FormErrors): void {
    const {
        form: {toAsset},
    } = props;
    if (!toAsset) {
        mergeError(FormSection.toAssetInput, new ToAssetNotSelected(), errors);
    }
}

/**
 * priorities: checkToAssetDropdown > checkToAssetAmount
 */
export default [checkToAssetDropdown, checkToAssetAmount];
