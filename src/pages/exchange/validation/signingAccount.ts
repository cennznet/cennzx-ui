import {AccountNotSelected} from '../../../error/error';
import {ExchangeProps, FormSection} from '../exchange';
import {FormErrors, mergeError} from './index';

function checkAccountAvailable(props: ExchangeProps, errors: FormErrors): void {
    const {
        form: {signingAccount},
    } = props;
    if (!signingAccount) {
        mergeError(FormSection.account, new AccountNotSelected(), errors);
    }
}

export default [checkAccountAvailable];
