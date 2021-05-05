import {InjectedExtension} from '@polkadot/extension-inject/types';
import {createAction} from 'redux-actions';
import {BaseError} from '../../error/error';
import {IAccounts} from '../../typings';

export enum ExtensionActions {
    DETECTION_UPDATE = 'POLKADOT_EX/DETECTION_UPDATE',
    CONNECTION_UPDATE = 'POLKADOT_EX/CONNECTION_UPDATE',
    ACCOUNTS_UPDATE = 'POLKADOT_EX/ACCOUNTS_UPDATE',
    DETECTION_COMPLETED = 'POLKADOT_EX/DETECTION_COMPLETED',
    ERROR_SET = 'POLKADOT_EX/ERROR_SET',
    POLKADOT_EXTENSION_UPDATE = 'POLKADOT_EX/POLKADOT_EXTENSION_UPDATE',
}

export const updateExDetected = createAction(
    ExtensionActions.DETECTION_UPDATE,
    (detected: boolean, polkadotInjected: InjectedExtension) => {
        return {detected, polkadotInjected};
    }
);

export const updateExConnected = createAction(
    ExtensionActions.CONNECTION_UPDATE,
    (ssConnected: boolean) => ssConnected
);

export const updatePolkadotExtension = createAction(
    ExtensionActions.POLKADOT_EXTENSION_UPDATE,
    (polkadotExtension: InjectedExtension) => polkadotExtension
);

export const updateExDetectionCompleted = createAction(ExtensionActions.DETECTION_COMPLETED);

export const updateExAccounts = createAction(ExtensionActions.ACCOUNTS_UPDATE, (exAccounts: IAccounts[]) => exAccounts);

export const setExtensionError = createAction(ExtensionActions.ERROR_SET, (errorMsg: BaseError) => errorMsg);

export type UpdateExDetectedAction = ReturnType<typeof updateExDetected>;

export type UpdateExConnectedAction = ReturnType<typeof updateExConnected>;

export type UpdateExAccountAction = ReturnType<typeof updateExAccounts>;

export type UpdatePolkadotExtensionAction = ReturnType<typeof updatePolkadotExtension>;

export type UpdateExDetectionCompleteAction = ReturnType<typeof updateExDetectionCompleted>;

export type SetExtensionErrorAction = ReturnType<typeof setExtensionError>;

export default ExtensionActions;
