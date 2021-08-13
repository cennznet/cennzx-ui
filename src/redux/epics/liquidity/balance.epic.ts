import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, Observable} from 'rxjs';
import {of} from 'rxjs/internal/observable/of';
import {filter, map, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {IEpicDependency} from '../../../typings';
import {ADD_LIQUIDITY} from '../../../util/extrinsicUtil';
import types from '../../actions';
import {requestUserAssetBalance} from '../../actions/ui/liquidity.action';
import {AppState} from '../../reducers';

export const prepareRequestUserBalanceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([
        api$,
        action$.pipe(
            ofType(
                types.ui.Liquidity.SELECTED_ASSET1_UPDATE,
                types.ui.Liquidity.SELECTED_ACCOUNT_UPDATE,
                types.ui.Liquidity.EXTRINSIC_UPDATE
            )
        ),
    ]).pipe(
        withLatestFrom(store$),
        filter(
            ([, store]) =>
                //@ts-ignore
                store.ui.liquidity.form.assetId &&
                !!store.ui.liquidity.form.signingAccount &&
                store.ui.liquidity.form.extrinsic === ADD_LIQUIDITY
        ),
        switchMap(
            ([[api], store]): Observable<Action<any>> => {
                const {assetId, signingAccount} = store.ui.liquidity.form;
                return of(requestUserAssetBalance(assetId, signingAccount));
            }
        )
    );

export default combineEpics(prepareRequestUserBalanceEpic);
