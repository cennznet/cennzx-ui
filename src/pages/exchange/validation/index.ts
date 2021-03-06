import {FormErrorTypes} from '../../../error/error';
import {ExchangeProps, FormSection} from '../exchange';
import fromAssetInputRules from './fromAssetInput';
import poolBalanceRules from './poolBalance';
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
const rules: ValidationRule[] = [
    ...accountRules,
    ...poolBalanceRules,
    ...toAssetInputRules,
    ...fromAssetInputRules,
    ...userBalanceRules,
];

export type FormErrors = Map<FormSection, FormErrorTypes[]>;

export interface ValidationRule {
    (props: ExchangeProps, errors: FormErrors): void;
}

export default function(props: ExchangeProps): FormErrors {
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
