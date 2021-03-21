import {createAction} from 'redux-actions';
import {BaseError} from '../../error/error';
import {CennznetInjected, PolkadotInjectedGlobal, IAccounts} from '../../typings';

export enum ExtensionActions {
    DETECTION_UPDATE = 'SS_EX/DETECTION_UPDATE',
    CONNECTION_UPDATE = 'SS_EX/CONNECTION_UPDATE',
    ACCOUNTS_UPDATE = 'SS_EX/ACCOUNTS_UPDATE',
    DETECTION_COMPLETED = 'SS_EX/DETECTION_COMPLETED',
    ERROR_SET = 'SS_EX/ERROR_SET',
}

export const updateSSDetected = createAction(
    ExtensionActions.DETECTION_UPDATE,
    (detected: boolean, polkadotInjected: PolkadotInjectedGlobal) => {
        console.log('Reached inside updateSSDetected:', detected);
        console.log('polkadotInjected:', polkadotInjected);
        return {detected, polkadotInjected};
    }
);

export const updateSSConnected = createAction(
    ExtensionActions.CONNECTION_UPDATE,
    (ssConnected: boolean) => ssConnected
);

export const updateSSDetectionCompleted = createAction(ExtensionActions.DETECTION_COMPLETED);

export const updateSSAccounts = createAction(ExtensionActions.ACCOUNTS_UPDATE, (ssAccounts: IAccounts[]) => ssAccounts);

export const setExtensionError = createAction(ExtensionActions.ERROR_SET, (errorMsg: BaseError) => errorMsg);

export type UpdateSSDetectedAction = ReturnType<typeof updateSSDetected>;

export type UpdateSSConnectedAction = ReturnType<typeof updateSSConnected>;

export type UpdateSSAccountAction = ReturnType<typeof updateSSAccounts>;

export type UpdateSSDetectionCompleteAction = ReturnType<typeof updateSSDetectionCompleted>;

export type SetExtensionErrorAction = ReturnType<typeof setExtensionError>;

export default ExtensionActions;
