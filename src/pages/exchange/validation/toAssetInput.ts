import {FieldNotReady, ToAssetAmountRequired, ToAssetNotSelected} from '../../../error/error';
import {ExchangeProps, FormSection} from '../exchange';
import {existErrors, FormErrors, mergeError} from './index';

function checkToAssetAmount(props: ExchangeProps, errors: FormErrors): void {
    if (existErrors(['PoolBalanceNotEnough', 'ToAssetNotSelected'], errors)) {
        return;
    }
    const {
        form: {toAssetAmount, fromAssetAmount},
    } = props;
    if (!toAssetAmount) {
        if (fromAssetAmount) {
            mergeError(FormSection.toAssetInput, new FieldNotReady(FormSection.toAssetInput), errors);
        } else {
            mergeError(FormSection.toAssetInput, new ToAssetAmountRequired(), errors);
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
