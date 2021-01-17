import {FeeRate} from '@cennznet/types/runtime/cennzX';
import produce from 'immer';
import {handleActions} from 'redux-actions';
import GlobalActions, {UpdateCoreAssetAction, UpdateFeeRateAction} from '../actions/global.action';

export interface GlobalState {
    coreAsset?: any;
    feeRate?: FeeRate;
}

export const initialState: GlobalState = {};

export default handleActions(
    {
        [GlobalActions.CORE_ASSET_UPDATE]: produce((draft: GlobalState, action: UpdateCoreAssetAction) => {
            draft.coreAsset = action.payload;
        }),
        [GlobalActions.DEFAULT_FEE_RATE_UPDATE]: produce((draft: GlobalState, action: UpdateFeeRateAction) => {
            draft.feeRate = action.payload;
        }),
    },
    initialState
);
