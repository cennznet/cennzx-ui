import {InjectedExtension} from '@polkadot/extension-inject/types';
import {createAction} from 'redux-actions';
import {BaseError} from '../../error/error';
import {IAccounts} from '../../typings';

export enum ExtensionActions {
    DETECTION_UPDATE = 'CENNZNET_EX/DETECTION_UPDATE',
    CONNECTION_UPDATE = 'CENNZNET_EX/CONNECTION_UPDATE',
    ACCOUNTS_UPDATE = 'CENNZNET_EX/ACCOUNTS_UPDATE',
    DETECTION_COMPLETED = 'CENNZNET_EX/DETECTION_COMPLETED',
    ERROR_SET = 'CENNZNET_EX/ERROR_SET',
    CENNZNET_EXTENSION_UPDATE = 'CENNZNET_EX/CENNZNET_EXTENSION_UPDATE',
}

export const updateExDetected = createAction(
    ExtensionActions.DETECTION_UPDATE,
    (detected: boolean, cennznetExtensionInjected: InjectedExtension) => {
        return {detected, cennznetExtensionInjected};
    }
);

export const updateExConnected = createAction(
    ExtensionActions.CONNECTION_UPDATE,
    (ssConnected: boolean) => ssConnected
);

export const updateCENNZnetExtension = createAction(
    ExtensionActions.CENNZNET_EXTENSION_UPDATE,
    (cennznetExtension: InjectedExtension) => cennznetExtension
);

export const updateExDetectionCompleted = createAction(ExtensionActions.DETECTION_COMPLETED);

export const updateExAccounts = createAction(ExtensionActions.ACCOUNTS_UPDATE, (exAccounts: IAccounts[]) => exAccounts);

export const setExtensionError = createAction(ExtensionActions.ERROR_SET, (errorMsg: BaseError) => errorMsg);

export type UpdateExDetectedAction = ReturnType<typeof updateExDetected>;

export type UpdateExConnectedAction = ReturnType<typeof updateExConnected>;

export type UpdateExAccountAction = ReturnType<typeof updateExAccounts>;

export type UpdateCENNZnetExtensionAction = ReturnType<typeof updateCENNZnetExtension>;

export type UpdateExDetectionCompleteAction = ReturnType<typeof updateExDetectionCompleted>;

export type SetExtensionErrorAction = ReturnType<typeof setExtensionError>;

export default ExtensionActions;
