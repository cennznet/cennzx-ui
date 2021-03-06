import {StateObservable} from 'redux-observable';
import {Observable, Subject} from 'rxjs';
import {ReplaySubject} from 'rxjs';
import types from '../../../actions';
import {AppState} from '../../../reducers';
import {TestScheduler} from 'rxjs/testing';
import {IEpicDependency} from '../../../../typings';
import {
    requestAssetBalance,
    updateFeeAsset,
    updateFromAssetAmount,
    updateSelectedAccount,
    updateSelectedFromAsset,
    updateSelectedToAsset,
    updateToAssetAmount,
} from '../../../actions/ui/exchange.action';
import {Amount} from '../../../../util/Amount';
import {of} from 'rxjs/index';
import {prepareBalanceParamsForFeeAssetEpic, updateAssetsBalanceEpic} from '../../exchange/updatePayAssetBalance.epic';
import {SWAP_INPUT} from '../../../../util/extrinsicUtil';
import {requestTransactionFeeEpic} from '../../exchange/transactionFee.epic';

const accounts$ = new ReplaySubject<any>(1);
const account = [
    {
        name: 'Account 1',
        address: '5GDq1kEpNzxWQcnviMRFnp1y8m47kWC1EDEUzgCZQFc4G1Df',
    },
];
accounts$.next(account);

describe('trigger on request asset balance epic works', () => {
    const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
    // const triggers = [setFromAssetAmount(inputAmount)];
    const triggers = [requestAssetBalance(16000, newAccount)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_           = '-a-';
                // prettier-ignore
                const getFreeBalance_   = ' -b-';
                // prettier-ignore
                const locks_            = ' -d-';
                // prettier-ignore
                const stakingAsset_     = ' -e-';
                // prettier-ignore
                const expect_           = '---c';

                const action$ = hot(action_, {
                    a: action,
                });
                const StakingAsset = {
                    toNumber: function() {
                        return 16000;
                    },
                };
                const BalanceLock = {
                    toArray: function() {
                        return [];
                    },
                };

                const api$ = of({
                    query: {
                        genericAsset: {
                            freeBalance: () =>
                                cold(getFreeBalance_, {
                                    b: new Amount(22),
                                }),
                            locks: () =>
                                cold(locks_, {
                                    d: BalanceLock,
                                }),
                        },
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        exchange: {
                            form: {signingAccount: newAccount, feeAssetId: 16000},
                            userAssetBalance: [],
                        },
                    },
                    global: {
                        stakingAssetId: StakingAsset,
                    },
                });

                const output$ = updateAssetsBalanceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Exchange.USER_ASSET_BALANCE_UPDATE,
                        payload: {
                            assetId: 16000,
                            account: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
                            balance: new Amount(22), // User's staked balance is empty so everything in free balance can be used
                        },
                    },
                });
            });
        });
    });
});

describe('Request asset balance working', () => {
    const feeAsset = 16001;
    const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
    const triggers = [updateSelectedAccount(newAccount), updateFeeAsset(feeAsset)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const expect_                   = '-c';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    cennzx: {},
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        exchange: {
                            form: {
                                fromAsset: 16000,
                                toAsset: 16001,
                                feeAssetId: 16001,
                                fromAssetAmount: new Amount(2),
                                toAssetAmount: new Amount(1),
                                signingAccount: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
                                extrinsic: SWAP_INPUT,
                            },
                        },
                    },
                });

                const output$ = prepareBalanceParamsForFeeAssetEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Exchange.ASSET_BALANCE_REQUEST,
                        payload: {assetId: 16001, signingAccount: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'},
                    },
                });
            });
        });
    });
});
