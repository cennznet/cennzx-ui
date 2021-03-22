import {InjectedExtension} from '@polkadot/extension-inject/types';
import produce from 'immer';
import {handleActions} from 'redux-actions';
import {BaseError} from '../../error/error';
import {IAccounts} from '../../typings';
import {
    ExtensionActions,
    SetExtensionErrorAction,
    UpdateExAccountAction,
    UpdateExConnectedAction,
    UpdateExDetectedAction,
    UpdatePolkadotExtensionAction,
} from '../actions/extension.action';

export interface ExtensionState {
    extensionDetected: boolean;
    extensionConnected: boolean;
    extensionDetectionComplete: boolean;
    polkadotExtension: InjectedExtension;
    accounts: IAccounts[];
    error: BaseError;
}

export const initialState: ExtensionState = {
    extensionDetected: false,
    extensionConnected: false,
    extensionDetectionComplete: false,
    accounts: [],
    error: null,
    polkadotExtension: undefined,
};

export default handleActions<ExtensionState, any>(
    {
        [ExtensionActions.DETECTION_UPDATE]: produce((draft: ExtensionState, action: UpdateExDetectedAction) => {
            draft.extensionDetected = action.payload.detected;
        }),
        [ExtensionActions.CONNECTION_UPDATE]: produce((draft: ExtensionState, action: UpdateExConnectedAction) => {
            draft.extensionConnected = action.payload;
        }),
        [ExtensionActions.ACCOUNTS_UPDATE]: produce((draft: ExtensionState, action: UpdateExAccountAction) => {
            draft.accounts = action.payload;
        }),
        [ExtensionActions.ERROR_SET]: produce((draft: ExtensionState, action: SetExtensionErrorAction) => {
            draft.error = action.payload;
        }),
        [ExtensionActions.POLKADOT_EXTENSION_UPDATE]: produce(
            (draft: ExtensionState, action: UpdatePolkadotExtensionAction) => {
                draft.polkadotExtension = action.payload;
            }
        ),
    },
    initialState
);
