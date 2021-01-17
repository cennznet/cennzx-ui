import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, Observable, of} from 'rxjs/index';
import {catchError, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {EmptyPool} from '../../../error/error';
import {IEpicDependency} from '../../../typings';
import {Amount} from '../../../util/Amount';
import {getAsset} from '../../../util/assets';
import types from '../../actions';
import {
    setExchangeError,
    updatePoolBalance,
    UpdatePoolBalanceAction,
    UpdateSelectedFromAssetAction,
    UpdateSelectedToAssetAction,
} from '../../actions/ui/send.action';
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
                types.ui.Send.SELECTED_TO_ASSET_UPDATE,
                types.ui.Send.SELECTED_FROM_ASSET_UPDATE
            )
        ),
    ]).pipe(
        withLatestFrom(store$),
        switchMap(
            ([[api, action], store]): Observable<Action<any>> => {
                const poolAsset = action.payload;
                return api.query.cennzx.coreAssetId().pipe(
                    switchMap(coreAsset => {
                        if (poolAsset.toString() === coreAsset.toString()) {
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
                                    return of(setExchangeError(new EmptyPool(getAsset(poolAsset))));
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
                    })
                );
            }
        )
    );

export default combineEpics(getAssetPoolBalanceEpic);
