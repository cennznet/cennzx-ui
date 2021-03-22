import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, Observable, of} from 'rxjs/index';
import {switchMap, withLatestFrom} from 'rxjs/operators';
import {IEpicDependency} from '../../../typings';
import {Amount} from '../../../util/Amount';
import types from '../../actions';
import {updatePoolBalance, UpdatePoolBalanceAction} from '../../actions/ui/liquidityPool.action';
import {AppState} from '../../reducers';

export const getPoolBalanceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<UpdatePoolBalanceAction> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.LiquidityPool.POOL_BALANCE_REQUEST))]).pipe(
        withLatestFrom(store$),
        switchMap(
            ([[api, action], store]): Observable<Action<any>> => {
                const {exchangePool} = store.ui.liquidityPool;
                return combineLatest([
                    api.cennzx.getPoolAssetBalance(action.payload),
                    api.cennzx.getPoolCoreAssetBalance(action.payload),
                    api.derive.cennzx.exchangeAddress(action.payload),
                ]).pipe(
                    switchMap(([assetBalance, coreBalance, exchangeAddress]) => {
                        const coreAssetBalance: Amount = new Amount(coreBalance);
                        const poolAssetBalance: Amount = new Amount(assetBalance);
                        const poolBalance = {
                            coreAssetBalance: coreAssetBalance,
                            assetBalance: poolAssetBalance,
                            address: exchangeAddress.toString(),
                            assetId: action.payload,
                        };
                        if (
                            !exchangePool ||
                            !(
                                exchangePool.coreAssetBalance.eq(poolBalance.coreAssetBalance) &&
                                exchangePool.assetBalance.eq(poolBalance.assetBalance) &&
                                exchangePool.address === poolBalance.address &&
                                exchangePool.assetId === poolBalance.assetId
                            )
                        ) {
                            return of(updatePoolBalance(poolBalance));
                        }
                        return EMPTY;
                    })
                );
            }
        )
    );

export default combineEpics(getPoolBalanceEpic);
