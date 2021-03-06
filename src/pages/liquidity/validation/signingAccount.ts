import {AccountNotSelected} from '../../../error/error';
import {FormSection, LiquidityProps} from '../liquidity';
import {FormErrors, mergeError} from './index';

function checkAccountAvailable(props: LiquidityProps, errors: FormErrors): void {
    const {
        form: {signingAccount},
    } = props;
    if (!signingAccount) {
        mergeError(FormSection.account, new AccountNotSelected(), errors);
    }
}

export default [checkAccountAvailable];
