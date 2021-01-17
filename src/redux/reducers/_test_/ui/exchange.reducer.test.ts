import actions from '../../../actions';
import reducer, {initialState} from '../../ui/exchange.reducer';

describe('Exchange reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {} as any)).toEqual(initialState);
    });

    it('should handle update selected account', () => {
        const action = {
            type: actions.ui.Exchange.SELECTED_ACCOUNT_UPDATE,
            payload: '5DqMKyro24J7AWzZRjcb1ovKWynwFDKQAFAorTMY82epJyDT',
        };

        expect(reducer(initialState, action)).toEqual({
            signingAccount: '5DqMKyro24J7AWzZRjcb1ovKWynwFDKQAFAorTMY82epJyDT',
        });
    });

    it('should handle update selected from asset', () => {
        const action = {
            type: actions.ui.Exchange.SELECTED_FROM_ASSET_UPDATE,
            payload: 16001,
        };

        expect(reducer(initialState, action)).toEqual({fromAsset: 16001});
    });

    it('should handle update selected to asset', () => {
        const action = {
            type: actions.ui.Exchange.SELECTED_TO_ASSET_UPDATE,
            payload: 16003,
        };

        expect(reducer(initialState, action)).toEqual({toAsset: 16003});
    });

    it('should handle set from asset amount', () => {
        const action = {
            type: actions.ui.Exchange.FROM_ASSET_AMOUNT_SET,
            payload: 11,
        };

        expect(reducer(initialState, action)).toEqual({fromAssetAmount: 11});
    });

    it('should handle set to asset amount', () => {
        const action = {
            type: actions.ui.Exchange.TO_ASSET_AMOUNT_SET,
            payload: 12,
        };

        expect(reducer(initialState, action)).toEqual({toAssetAmount: 12});
    });

    it('should handle update from asset amount', () => {
        const action = {
            type: actions.ui.Exchange.FROM_ASSET_AMOUNT_UPDATE,
            payload: 11,
        };

        expect(reducer(initialState, action)).toEqual({fromAssetAmount: 11});
    });

    it('should handle update to asset amount', () => {
        const action = {
            type: actions.ui.Exchange.TO_ASSET_AMOUNT_UPDATE,
            payload: 12,
        };

        expect(reducer(initialState, action)).toEqual({toAssetAmount: 12});
    });

    // it('should handle update trade type (Buy/Sell)', () => {
    //     const action = {
    //         type: actions.ui.Exchange.TRADE_TYPE_UPDATE,
    //         payload: true,
    //     };
    //
    //     expect(reducer({}, action)).toEqual({isBuy: true});
    // });
});
