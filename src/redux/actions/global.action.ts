import {SubmittableResult} from '@cennznet/api/polkadot';
import {ICennznetExtrinsic} from '@cennznet/api/types';
import {createAction} from 'redux-actions';
import {Observable} from 'rxjs/index';

export enum GlobalActions {
    UNKNOWN_ERROR = 'app/UNKNOWN_ERROR',
    INIT_APP = 'app/INIT',
    CORE_ASSET_UPDATE = 'app/CORE_ASSET_UPDATE',
    DEFAULT_FEE_RATE_UPDATE = 'app/DEFAULT_FEE_RATE_UPDATE',
    GENESIS_HASH = 'app//GENESIS_HASH',
}

export const updateAppError = createAction(GlobalActions.UNKNOWN_ERROR, (err: Error) => err);

export const updateCoreAsset = createAction(GlobalActions.CORE_ASSET_UPDATE, coreAssetId => coreAssetId);

export const updateFeeRate = createAction(GlobalActions.DEFAULT_FEE_RATE_UPDATE, feeRate => feeRate);

export const updateGenesisHash = createAction(GlobalActions.GENESIS_HASH, genesisHash => genesisHash);

export type UpdateCoreAssetAction = ReturnType<typeof updateCoreAsset>;

export type UpdateFeeRateAction = ReturnType<typeof updateFeeRate>;

export type UpdateGenesisHashAction = ReturnType<typeof updateGenesisHash>;

export default GlobalActions;
