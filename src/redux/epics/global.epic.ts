import {AssetId} from '@cennznet/types';
import {defaults as addressDefaults} from '@polkadot/util-crypto/address/defaults';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, from, Observable, of} from 'rxjs';
import {ajax} from 'rxjs/ajax';
import {catchError, map, switchMap} from 'rxjs/operators';
import {IEpicDependency} from '../../typings';
import {setExchangeError, updateFeeAsset} from '../actions/ui/exchange.action';
import {updateFeeAsset as updateLiquidityFeeAsset, updateSelectedAsset2} from '../actions/ui/liquidity.action';
import {AppState} from '../reducers';
import types, {
    updateAssetsInfo,
    updateCoreAsset,
    updateFeeRate,
    updateMetadata,
    updateStakingAsset,
} from './../actions/global.action';

export const getCoreAsset = (action$: Observable<Action<any>>, store$: Observable<AppState>, {api$}: IEpicDependency) =>
    combineLatest([api$, action$.pipe(ofType(types.INIT_APP))]).pipe(
        switchMap(
            ([api]): Observable<Action<any>> => {
                return api.query.cennzx.coreAssetId().pipe(
                    switchMap((coreAssetId: AssetId) => {
                        // update core asset and second asset on liquidity page
                        return from([
                            updateCoreAsset(coreAssetId.toNumber()),
                            updateSelectedAsset2(coreAssetId.toNumber()),
                        ]);
                    })
                );
            }
        )
    );

export const getFeeRate = (action$: Observable<Action<any>>, store$: Observable<AppState>, {api$}: IEpicDependency) =>
    combineLatest([api$, action$.pipe(ofType(types.INIT_APP))]).pipe(
        switchMap(
            ([api]): Observable<Action<any>> => {
                return api.query.cennzx.defaultFeeRate().pipe(map(feeRate => updateFeeRate(feeRate)));
            }
        )
    );
export const getStakingAsset = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) =>
    combineLatest([api$, action$.pipe(ofType(types.INIT_APP))]).pipe(
        switchMap(
            ([api]): Observable<Action<any>> => {
                return api.query.genericAsset.stakingAssetId().pipe(map(assetId => updateStakingAsset(assetId)));
            }
        )
    );

export const getFeeAsset = (action$: Observable<Action<any>>, store$: Observable<AppState>, {api$}: IEpicDependency) =>
    combineLatest([api$, action$.pipe(ofType(types.INIT_APP))]).pipe(
        switchMap(
            ([api]): Observable<Action<any>> => {
                return api.query.genericAsset.spendingAssetId().pipe(
                    switchMap((feeAssetId: AssetId) => {
                        return from([
                            updateFeeAsset(feeAssetId.toNumber()),
                            updateLiquidityFeeAsset(feeAssetId.toNumber()),
                        ]);
                    })
                );
            }
        )
    );

const getExtensionMetadata = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) =>
    combineLatest([
        api$,
        action$.pipe(ofType(types.INIT_APP)),
        ajax.getJSON(
            'https://raw.githubusercontent.com/cennznet/api.js/master/extension-releases/runtimeModuleTypes.json'
        ),
    ]).pipe(
        switchMap(
            ([api, , additionalTypes]): Observable<Action<any>> => {
                return api.rpc.system.chain().pipe(
                    map(systemChain => {
                        const genesisHashExpected = api.genesisHash.toHex();
                        if (additionalTypes) {
                            let typesForCurrentChain = additionalTypes[genesisHashExpected];
                            // if not able to find types, take the first element (in case of local node the genesis Hash keep changing)
                            typesForCurrentChain =
                                typesForCurrentChain === undefined
                                    ? Object.values(additionalTypes)[0]
                                    : typesForCurrentChain;
                            let specTypes, userExtensions;
                            if (typesForCurrentChain) {
                                specTypes = typesForCurrentChain.types;
                                userExtensions = typesForCurrentChain.userExtensions;
                            }
                            const DEFAULT_SS58 = api.registry.createType('u32', addressDefaults.prefix);
                            const DEFAULT_DECIMALS = api.registry.createType('u32', 4);
                            const metadata = {
                                chain: systemChain,
                                color: '#191a2e',
                                genesisHash: api.genesisHash.toHex(),
                                icon: 'CENNZnet',
                                metaCalls: Buffer.from(api.runtimeMetadata.asCallsOnly.toU8a()).toString('base64'),
                                specVersion: api.runtimeVersion.specVersion.toNumber(),
                                ss58Format: DEFAULT_SS58.toNumber(),
                                tokenDecimals: DEFAULT_DECIMALS.toNumber(),
                                tokenSymbol: 'CENNZ',
                                types: specTypes,
                                userExtensions: userExtensions,
                            };
                            return updateMetadata(metadata);
                        }
                        return EMPTY;
                    })
                );
            }
        ),
        catchError((err: any) => {
            return of(setExchangeError(err));
        })
    );

export const getRegisteredAssets = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) =>
    combineLatest([api$, action$.pipe(ofType(types.INIT_APP))]).pipe(
        switchMap(
            ([api]): Observable<Action<any>> => {
                return api.rpc.genericAsset.registeredAssets().pipe(map(assets => updateAssetsInfo(assets.toJSON())));
            }
        ),
        catchError((err: any) => {
            return of(setExchangeError(err));
        })
    );

export default combineEpics(
    getCoreAsset,
    getStakingAsset,
    getFeeRate,
    getFeeAsset,
    getExtensionMetadata,
    getRegisteredAssets
);
