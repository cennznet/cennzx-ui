import {FieldNotReady, FromAssetAmountRequired, FromAssetNotSelected, RecipientAddress} from '../../../error/error';
import {SendProps, FormSection} from '../send';
import {existErrors, FormErrors, mergeError} from './index';

function checkFromAssetAmount(props: SendProps, errors: FormErrors): void {
    const {
        form: {toAssetAmount, fromAssetAmount, recipientAddress},
    } = props;
    if (existErrors(['PoolBalanceNotEnough', 'FromAssetNotSelected'], errors)) {
        return;
    }

    if (!fromAssetAmount) {
        if (toAssetAmount) {
            mergeError(FormSection.fromAssetInput, new FieldNotReady(FormSection.fromAssetInput), errors);
        } else {
            mergeError(FormSection.fromAssetInput, new FromAssetAmountRequired(), errors);
        }
    }
    if (!recipientAddress) {
        mergeError(FormSection.recipientAddress, new RecipientAddress(), errors);
    }
}

function checkFromAssetDropdown(props: SendProps, errors: FormErrors): void {
    const {
        form: {fromAsset},
    } = props;
    if (!fromAsset) {
        mergeError(FormSection.fromAssetInput, new FromAssetNotSelected(), errors);
    }
}

export default [checkFromAssetDropdown, checkFromAssetAmount];
