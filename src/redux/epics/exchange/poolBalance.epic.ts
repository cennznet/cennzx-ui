import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, Observable, of} from 'rxjs/index';
import {catchError, filter, mergeMap, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {EmptyPool} from '../../../error/error';
import {IEpicDependency} from '../../../typings';
import {Amount} from '../../../util/Amount';
import types from '../../actions';
import {
    setExchangeError,
    updatePoolBalance,
    UpdatePoolBalanceAction,
    UpdateSelectedFromAssetAction,
    UpdateSelectedToAssetAction,
} from '../../actions/ui/exchange.action';
import {AppState} from '../../reducers';

export const getAssetPoolBalanceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<UpdatePoolBalanceAction> =>
    combineLatest([
        api$,
        action$.pipe(
            ofType<UpdateSelectedToAssetAction | UpdateSelectedFromAssetAction>(
                types.ui.Exchange.SELECTED_TO_ASSET_UPDATE,
                types.ui.Exchange.SELECTED_FROM_ASSET_UPDATE
            )
        ),
    ]).pipe(
        withLatestFrom(store$),
        filter(([, store]) => !!store.global.coreAssetId),
        mergeMap(
            ([[api, action], store]): Observable<Action<any>> => {
                const poolAsset = action.payload;
                const assetInfo = store.global.assetInfo;
                const coreAssetId = store.global.coreAssetId;
                if (poolAsset.toString() === coreAssetId.toString()) {
                    return EMPTY;
                }
                return combineLatest([
                    api.derive.cennzx.poolAssetBalance(poolAsset),
                    api.derive.cennzx.poolCoreAssetBalance(poolAsset),
                    api.derive.cennzx.exchangeAddress(poolAsset),
                ]).pipe(
                    switchMap(([assetBalance, coreBalance, exchangeAddress]) => {
                        const coreAssetBalance: Amount = new Amount(coreBalance);
                        const poolAssetBalance: Amount = new Amount(assetBalance);
                        if (coreAssetBalance.isZero() || poolAssetBalance.isZero()) {
                            return of(setExchangeError(new EmptyPool(assetInfo[poolAsset])));
                        }
                        const poolBalance = {
                            coreAssetBalance: coreAssetBalance,
                            assetBalance: poolAssetBalance,
                            address: exchangeAddress.toString(),
                            assetId: poolAsset,
                        };
                        return of(updatePoolBalance(poolBalance));
                    }),
                    takeUntil(action$.pipe(ofType(types.ui.Exchange.TRADE_RESET))),
                    catchError((err: any) => {
                        return of(setExchangeError(err));
                    })
                );
            }
        )
    );

export default combineEpics(getAssetPoolBalanceEpic);
