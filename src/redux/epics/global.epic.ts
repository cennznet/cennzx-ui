import {AssetId} from '@cennznet/types';
import {getSpecTypes} from '@polkadot/types-known';
import {defaults as addressDefaults} from '@polkadot/util-crypto/address/defaults';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {IEpicDependency} from '../../typings';
import {setExchangeError} from '../actions/ui/exchange.action';
import {cennznetExtensions} from '../cennznetExtensions';
import {AppState} from '../reducers';
import types, {updateCoreAsset, updateFeeRate, updateMetadata} from './../actions/global.action';

export const getCoreAsset = (action$: Observable<Action<any>>, store$: Observable<AppState>, {api$}: IEpicDependency) =>
    combineLatest([api$, action$.pipe(ofType(types.INIT_APP))]).pipe(
        switchMap(
            ([api]): Observable<Action<any>> => {
                return api.query.cennzx.coreAssetId().pipe(
                    map((coreAssetId: AssetId) => {
                        return updateCoreAsset(coreAssetId.toNumber());
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
                        // The reason for the removal of the following object from specTypes -
                        // the metadata that gets updated on the polkadot extension requires types of type (Record<string, string>)
                        // It does not allow classes/objects...
                        if (specTypes.ExtrinsicSignatureV4) {
                            delete specTypes.ExtrinsicSignatureV4;
                        }
                        if (specTypes.SignerPayload) {
                            delete specTypes.SignerPayload;
                        }
                        if (specTypes.ExtrinsicPayloadV4) {
                            delete specTypes.ExtrinsicPayloadV4;
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
                            types: (specTypes as unknown) as Record<string, string>,
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

export default combineEpics(getCoreAsset, getFeeRate, getExtensionMetadata);
