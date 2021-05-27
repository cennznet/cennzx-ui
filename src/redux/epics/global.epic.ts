import {AssetId} from '@cennznet/types';
import {getSpecTypes} from '@polkadot/types-known';
import {defaults as addressDefaults} from '@polkadot/util-crypto/address/defaults';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, from, Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {IEpicDependency} from '../../typings';
import {setExchangeError, updateFeeAsset} from '../actions/ui/exchange.action';
import {updateFeeAsset as updateLiquidityFeeAsset, updateSelectedAsset2} from '../actions/ui/liquidity.action';
import {cennznetExtensions} from '../cennznetExtensions';
import {AppState} from '../reducers';
import types, {updateAssetsInfo, updateCoreAsset, updateFeeRate, updateMetadata} from './../actions/global.action';

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
    combineLatest([api$, action$.pipe(ofType(types.INIT_APP))]).pipe(
        switchMap(
            ([api]): Observable<Action<any>> => {
                return api.rpc.system.chain().pipe(
                    map(systemChain => {
                        const specTypes = getSpecTypes(
                            api.registry,
                            systemChain,
                            api.runtimeVersion.specName,
                            api.runtimeVersion.specVersion
                        );
                        // remove all the classes from the spectypes
                        // the metadata that gets updated on the cennznet extension requires types of type (Record<string, string|object>)
                        const filteredSpecTypes = Object.keys(specTypes)
                            .filter(key => typeof specTypes[key] !== 'function')
                            .reduce((obj, key) => {
                                obj[key] = specTypes[key];
                                return obj;
                            }, {});

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
                            types: (filteredSpecTypes as unknown) as Record<string, string>,
                            userExtensions: cennznetExtensions,
                        };
                        return updateMetadata(metadata);
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

export default combineEpics(getCoreAsset, getFeeRate, getFeeAsset, getExtensionMetadata, getRegisteredAssets);
