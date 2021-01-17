import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, Observable, of} from 'rxjs/index';
import {filter, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {IEpicDependency} from '../../../typings';
import {Amount} from '../../../util/Amount';
import types from '../../actions';
import {
    updateInvestorFreeBalance,
    UpdateInvestorFreeBalanceAction,
    updateTotalLiquidity,
} from '../../actions/ui/liquidityPool.action';
import {AppState} from '../../reducers';

export const getUserBalanceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<UpdateInvestorFreeBalanceAction> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.LiquidityPool.DEPOSIT_ASSET_UPDATE))]).pipe(
        withLatestFrom(store$),
        filter(([, store]) => !!store.ui.liquidityPool.addLiquidity.form.asset && !!store.global.coreAsset),
        switchMap(
            ([[api, action], store]): Observable<Action<any>> => {
                const {investorBalance} = store.ui.liquidityPool.addLiquidity;
                const {asset, investor} = store.ui.liquidityPool.addLiquidity.form;
                const coreAsset = store.global.coreAsset.toNumber();
                return combineLatest([
                    api.genericAsset.getFreeBalance(asset, investor),
                    api.genericAsset.getFreeBalance(coreAsset, investor),
                ]).pipe(
                    switchMap(([assetBalance, coreBalance]) => {
                        const coreBal: Amount = new Amount(coreBalance);
                        const assetBal: Amount = new Amount(assetBalance);
                        const userBalance = {
                            coreBalance: coreBal,
                            assetBalance: assetBal,
                            investor: investor,
                        };
                        if (!investorBalance && userBalance !== investorBalance) {
                            return of(updateInvestorFreeBalance(userBalance));
                        }
                        return EMPTY;
                    })
                );
            }
        )
    );

export default combineEpics(getUserBalanceEpic);
