import * as actions from '../../actions/extension.action';
import reducer, {initialState} from '../extension.reducer';

describe('singlesource reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {} as any)).toEqual(initialState);
    });

    it('should handle single source extension detected', () => {
        const action = {
            type: actions.ExtensionActions.DETECTION_UPDATE,
            payload: true,
        };

        expect(reducer(initialState, action)).toEqual({extensionDetected: true});
    });

    it('should handle single source extension not detected', () => {
        const action = {
            type: actions.ExtensionActions.DETECTION_UPDATE,
            payload: false,
        };

        expect(reducer(initialState, action)).toEqual({extensionDetected: false});
    });

    it('should handle single source extension connected', () => {
        const action = {
            type: actions.ExtensionActions.CONNECTION_UPDATE,
            payload: true,
        };

        expect(reducer(initialState, action)).toEqual({extensionConnected: true});
    });

    it('should handle single source extension not connected', () => {
        const action = {
            type: actions.ExtensionActions.CONNECTION_UPDATE,
            payload: false,
        };

        expect(reducer(initialState, action)).toEqual({extensionConnected: false});
    });

    it('should handle single source extension accounts', () => {
        const action = {
            type: actions.ExtensionActions.ACCOUNTS_UPDATE,
            payload: [
                {
                    name: 'Account 1',
                    assets: [
                        {
                            assetId: 16000,
                        },
                        {
                            assetId: 16001,
                        },
                    ],
                    address: '5GDq1kEpNzxWQcnviMRFnp1y8m47kWC1EDEUzgCZQFc4G1Df',
                },
                {
                    name: 'Account 2',
                    assets: [
                        {
                            assetId: 16000,
                        },
                        {
                            assetId: 16001,
                        },
                    ],
                    address: '5EppBjkT8uEDY46BZzjbgKoN6W2kR8syTTKd7oBoyoEwRUtD',
                },
            ],
        };

        expect(reducer(initialState, action)).toEqual({
            accounts: [
                {
                    name: 'Account 1',
                    assets: [
                        {
                            assetId: 16000,
                        },
                        {
                            assetId: 16001,
                        },
                    ],
                    address: '5GDq1kEpNzxWQcnviMRFnp1y8m47kWC1EDEUzgCZQFc4G1Df',
                },
                {
                    name: 'Account 2',
                    assets: [
                        {
                            assetId: 16000,
                        },
                        {
                            assetId: 16001,
                        },
                    ],
                    address: '5EppBjkT8uEDY46BZzjbgKoN6W2kR8syTTKd7oBoyoEwRUtD',
                },
            ],
        });
    });
});
