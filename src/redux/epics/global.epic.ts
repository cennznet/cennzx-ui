import {AssetId} from '@cennznet/types';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {IEpicDependency} from '../../typings';
import {AppState} from '../reducers';
import types, {updateCoreAsset, updateFeeRate, updateGenesisHash} from './../actions/global.action';

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

const getGenesisHash = (action$: Observable<Action<any>>, store$: Observable<AppState>, {api$}: IEpicDependency) =>
    combineLatest([api$, action$.pipe(ofType(types.INIT_APP))]).pipe(
        map(([api]) => updateGenesisHash(api.genesisHash))
    );

export default combineEpics(getCoreAsset, getFeeRate, getGenesisHash);
