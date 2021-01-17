import {AccountNotSelected} from '../../../error/error';
import {SendProps, FormSection} from '../send';
import {FormErrors, mergeError} from './index';

function checkAccountAvailable(props: SendProps, errors: FormErrors): void {
    const {
        form: {signingAccount},
    } = props;
    if (!signingAccount) {
        mergeError(FormSection.account, new AccountNotSelected(), errors);
    }
}

export default [checkAccountAvailable];
