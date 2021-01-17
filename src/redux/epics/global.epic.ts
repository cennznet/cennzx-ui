import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, from, Observable, of, timer} from 'rxjs';
import {map, switchMap, catchError} from 'rxjs/operators';
import {IEpicDependency} from '../../typings';
import {UpdateSSDetectedAction} from '../actions/extension.action';
import {AppState} from '../reducers';
import types, {updateCoreAsset, updateFeeRate} from './../actions/global.action';

export const getCoreAsset = (action$: Observable<Action<any>>, store$: Observable<AppState>, {api$}: IEpicDependency) =>
    combineLatest([api$, action$.pipe(ofType(types.INIT_APP))]).pipe(
        switchMap(
            ([api]): Observable<Action<any>> => {
                return api.query.cennzx.coreAssetId().pipe(
                    map(coreAsset => {
                        return updateCoreAsset(coreAsset as any);
                    })
                );
            }
        ),
        catchError(err => {
            console.log('coreAsset-error', err);
        })
    );

export const getFeeRate = (action$: Observable<Action<any>>, store$: Observable<AppState>, {api$}: IEpicDependency) =>
    combineLatest([api$, action$.pipe(ofType(types.INIT_APP))]).pipe(
        switchMap(
            ([api]): Observable<Action<any>> => {
                return api.query.cennzx.defaultFeeRate().pipe(map(feeRate => updateFeeRate(feeRate)));
            }
        )
    );

export default combineEpics(getCoreAsset, getFeeRate);
