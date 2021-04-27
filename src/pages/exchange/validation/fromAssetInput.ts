import {FieldNotReady, FromAssetAmountRequired, FromAssetNotSelected} from '../../../error/error';
import {ExchangeProps, FormSection} from '../exchange';
import {existErrors, FormErrors, mergeError} from './index';

function checkFromAssetAmount(props: ExchangeProps, errors: FormErrors): void {
    const {
        form: {toAssetAmount, fromAssetAmount, fromAsset},
        assetInfo,
    } = props;
    if (existErrors(['PoolBalanceNotEnough', 'FromAssetNotSelected'], errors)) {
        return;
    }

    if (!fromAssetAmount) {
        if (toAssetAmount && toAssetAmount.gtn(0)) {
            mergeError(FormSection.fromAssetInput, new FieldNotReady(FormSection.fromAssetInput), errors);
        } else {
            mergeError(FormSection.fromAssetInput, new FromAssetAmountRequired(assetInfo[fromAsset].symbol), errors);
        }
    }
}

function checkFromAssetDropdown(props: ExchangeProps, errors: FormErrors): void {
    const {
        form: {fromAsset},
    } = props;
    if (!fromAsset) {
        mergeError(FormSection.fromAssetInput, new FromAssetNotSelected(), errors);
    }
}

/**
 * priorities: checkFromAssetDropdown > checkFromAssetAmount
 */
export default [checkFromAssetDropdown, checkFromAssetAmount];
