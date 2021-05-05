import {AssetInfo} from '@cennznet/types';
import {FeeRate} from '@cennznet/types/interfaces/cennzx';
import {MetadataDef} from '@polkadot/extension-inject/types';
import {hexToString} from '@polkadot/util';
import produce from 'immer';
import {handleActions} from 'redux-actions';

import GlobalActions, {
    UpdateAssetsInfoAction,
    UpdateCoreAssetAction,
    UpdateFeeRateAction,
    UpdateMetadataAction,
} from '../actions/global.action';

export interface AssetDetails {
    decimalPlaces: number;
    symbol: string;
    id: number;
}
export interface GlobalState {
    coreAssetId?: number;
    feeRate?: FeeRate;
    metadata?: MetadataDef;
    assetInfo: AssetDetails[];
}

export const initialState: GlobalState = {
    assetInfo: [],
};

export default handleActions(
    {
        [GlobalActions.CORE_ASSET_UPDATE]: produce((draft: GlobalState, action: UpdateCoreAssetAction) => {
            draft.coreAssetId = action.payload;
        }),
        [GlobalActions.DEFAULT_FEE_RATE_UPDATE]: produce((draft: GlobalState, action: UpdateFeeRateAction) => {
            draft.feeRate = action.payload;
        }),
        [GlobalActions.METADATA_UPDATE]: produce((draft: GlobalState, action: UpdateMetadataAction) => {
            draft.metadata = action.payload;
        }),
        [GlobalActions.ASSET_INFO_UPDATE]: produce((draft: GlobalState, action: UpdateAssetsInfoAction) => {
            const newAssetList = new Array();
            const assetList = action.payload;
            assetList.forEach(asset => {
                const id = asset[0];
                const symbol = hexToString(asset[1].symbol);
                const decimalPlaces = asset[1].decimalPlaces;
                newAssetList[id] = {decimalPlaces, symbol, id};
            });
            draft.assetInfo = newAssetList;
        }),
    },
    initialState
);
