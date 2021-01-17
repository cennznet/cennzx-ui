import produce from 'immer';
import {handleActions} from 'redux-actions';
import {BaseError} from '../../error/error';
import {IAccounts} from '../../typings';
import {
    ExtensionActions,
    SetExtensionErrorAction,
    UpdateSSAccountAction,
    UpdateSSConnectedAction,
    UpdateSSDetectedAction,
} from '../actions/extension.action';

export interface ExtensionState {
    extensionDetected: boolean;
    extensionConnected: boolean;
    extensionDetectionComplete: boolean;
    accounts: IAccounts[];
    error: BaseError;
}

export const initialState: ExtensionState = {
    extensionDetected: false,
    extensionConnected: false,
    extensionDetectionComplete: false,
    accounts: [
        {
            name: 'Alice',
            assets: [
                {
                    assetId: 16000,
                },
                {
                    assetId: 16001,
                },
            ],
            address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        },
    ],
    error: null,
};

export default handleActions<ExtensionState, any>(
    {
        [ExtensionActions.DETECTION_UPDATE]: produce((draft: ExtensionState, action: UpdateSSDetectedAction) => {
            draft.extensionDetected = action.payload.detected;
        }),
        [ExtensionActions.CONNECTION_UPDATE]: produce((draft: ExtensionState, action: UpdateSSConnectedAction) => {
            draft.extensionConnected = action.payload;
        }),
        [ExtensionActions.ACCOUNTS_UPDATE]: produce((draft: ExtensionState, action: UpdateSSAccountAction) => {
            draft.accounts = action.payload;
        }),
        [ExtensionActions.ERROR_SET]: produce((draft: ExtensionState, action: SetExtensionErrorAction) => {
            draft.error = action.payload;
        }),
    },
    initialState
);
