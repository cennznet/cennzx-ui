import {createAction} from 'redux-actions';
import {Observable} from 'rxjs/index';

export enum GlobalActions {
    UNKNOWN_ERROR = 'app/UNKNOWN_ERROR',
    INIT_APP = 'app/INIT',
    CORE_ASSET_UPDATE = 'app/CORE_ASSET_UPDATE',
    DEFAULT_FEE_RATE_UPDATE = 'app/DEFAULT_FEE_RATE_UPDATE',
    METADATA_UPDATE = 'app//METADATA_UPDATE',
    ASSET_INFO_UPDATE = 'app/ASSET_INFO_UPDATE',
    STAKING_ASSET = 'app/STAKING_ASSET',
}

export const startApp = createAction(GlobalActions.INIT_APP);

export const updateAppError = createAction(GlobalActions.UNKNOWN_ERROR, (err: Error) => err);

export const updateCoreAsset = createAction(GlobalActions.CORE_ASSET_UPDATE, coreAssetId => coreAssetId);

export const updateFeeRate = createAction(GlobalActions.DEFAULT_FEE_RATE_UPDATE, feeRate => feeRate);

export const updateStakingAsset = createAction(GlobalActions.STAKING_ASSET, assetId => assetId);

export const updateMetadata = createAction(GlobalActions.METADATA_UPDATE, metadata => metadata);

export const updateAssetsInfo = createAction(GlobalActions.ASSET_INFO_UPDATE, assetInfo => assetInfo);

export type UpdateCoreAssetAction = ReturnType<typeof updateCoreAsset>;

export type UpdateFeeRateAction = ReturnType<typeof updateFeeRate>;

export type UpdateStakingAssetAction = ReturnType<typeof updateStakingAsset>;

export type UpdateMetadataAction = ReturnType<typeof updateMetadata>;

export type UpdateAssetsInfoAction = ReturnType<typeof updateAssetsInfo>;

export default GlobalActions;
