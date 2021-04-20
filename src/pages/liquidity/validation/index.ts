import {FormErrorTypes} from '../../../error/error';
import {FormSection, LiquidityProps} from '../liquidity';
import fromAssetInputRules from './fromAssetInput';
import accountRules from './signingAccount';
import toAssetInputRules from './toAssetInput';
import userBalanceRules from './userBalance';

export function mergeError(field: FormSection, error: FormErrorTypes, errors: FormErrors): void {
    if (!errors.has(field)) {
        errors.set(field, []);
    }
    errors.get(field).push(error);
}

type ErrorFilter = (e: FormErrorTypes) => boolean;

function flatternErrors(errors: FormErrors): FormErrorTypes[] {
    const ret: FormErrorTypes[] = [];
    for (const fieldErrors of errors.values()) {
        ret.push(...fieldErrors);
    }
    return ret;
}

export function existErrors(
    errorFilter: string | string[] | ErrorFilter,
    errors: FormErrors,
    field?: FormSection
): boolean {
    let filter: ErrorFilter;
    if (typeof errorFilter === 'string') {
        filter = error => error.name === errorFilter;
    } else if (errorFilter instanceof Array) {
        filter = error => errorFilter.includes(error.name);
    } else {
        filter = errorFilter;
    }

    const errorList = field ? errors.get(field) || [] : flatternErrors(errors);

    return errorList.findIndex(filter) > -1;
}

/**
 * priorities:
 * poolBalanceRules > fromAssetInputRules | toAssetInputRules
 * fromAssetInputRules > userBalanceRules
 */
const rules: ValidationRule[] = [...accountRules, ...userBalanceRules, ...toAssetInputRules, ...fromAssetInputRules];

export type FormErrors = Map<FormSection, FormErrorTypes[]>;

export interface ValidationRule {
    (props: LiquidityProps, errors: FormErrors): void;
}

export default function(props: LiquidityProps): FormErrors {
    const retErrors = new Map<FormSection, FormErrorTypes[]>();
    const {error} = props;
    if (error.length) {
        retErrors.set(FormSection.form, error);
        return retErrors;
    }
    for (const rule of rules) {
        rule(props, retErrors);
    }
    return retErrors;
}
