import {FeeRate} from '@cennznet/types/interfaces/cennzx';
import produce from 'immer';
import {handleActions} from 'redux-actions';
import GlobalActions, {
    UpdateCoreAssetAction,
    UpdateFeeRateAction,
    UpdateGenesisHashAction,
} from '../actions/global.action';

export interface GlobalState {
    coreAssetId?: any;
    feeRate?: FeeRate;
    genesisHash?: any;
}

export const initialState: GlobalState = {};

export default handleActions(
    {
        [GlobalActions.CORE_ASSET_UPDATE]: produce((draft: GlobalState, action: UpdateCoreAssetAction) => {
            draft.coreAssetId = action.payload;
        }),
        [GlobalActions.DEFAULT_FEE_RATE_UPDATE]: produce((draft: GlobalState, action: UpdateFeeRateAction) => {
            draft.feeRate = action.payload;
        }),
        [GlobalActions.GENESIS_HASH]: produce((draft: GlobalState, action: UpdateGenesisHashAction) => {
            console.log('HERE IN REDUCERE WITH PAYLOAD::', action.payload);
            draft.genesisHash = action.payload;
        }),
    },
    initialState
);
