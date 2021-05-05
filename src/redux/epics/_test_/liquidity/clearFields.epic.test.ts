import {StateObservable} from 'redux-observable';
import {Amount} from '../../../../util/Amount';
import {ADD_LIQUIDITY} from '../../../../util/extrinsicUtil';
import types from '../../../actions';
import {TestScheduler} from 'rxjs/testing';
import {Observable, of, Subject} from 'rxjs/index';
import {IEpicDependency} from '../../../../typings';
import {
    setAsset1Amount,
    setAsset2Amount,
    updateSelectedAccount,
    updateSelectedAsset1,
} from '../../../actions/ui/liquidity.action';
import {AppState} from '../../../reducers';
import {clearAmountEpic, clearExchangeRateAmountEpic, clearTxFeeEpic} from '../../liquidity/clearFields.epic';

describe('Clear exchange rate when asset is changed', () => {
    const triggers = [updateSelectedAsset1(16000)];
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
                                fromAssetAmount: new Amount(2),
                                toAssetAmount: new Amount(1),
                                signingAccount: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
                                extrinsic: ADD_LIQUIDITY,
                            },
                        },
                    },
                });

                const output$ = clearExchangeRateAmountEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Liquidity.EXCHANGE_RATE_UPDATE,
                        payload: undefined,
                    },
                });
            });
        });
    });
});

describe('Clear amount when asset is changed', () => {
    const triggers = [updateSelectedAsset1(16000)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const expect_                   = '-(bcd)';

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
                                fromAssetAmount: new Amount(2),
                                toAssetAmount: new Amount(1),
                                signingAccount: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
                                extrinsic: ADD_LIQUIDITY,
                            },
                        },
                    },
                });

                const output$ = clearAmountEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    b: {
                        type: types.ui.Liquidity.ASSET1_AMOUNT_UPDATE,
                    },
                    c: {
                        type: types.ui.Liquidity.ASSET2_AMOUNT_UPDATE,
                    },
                    d: {
                        type: types.ui.Liquidity.TOTAL_LIQUIDITY_UPDATE,
                    },
                });
            });
        });
    });
});

describe('Clear tx fee when asset is updated or amount is changed', () => {
    const amount = new Amount('2');
    const triggers = [
        updateSelectedAsset1(16000),
        updateSelectedAccount('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'),
        setAsset1Amount(amount),
        setAsset2Amount(amount),
    ];
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
                        liquidity: {
                            form: {
                                assetId: 16000,
                                coreAssetId: 16001,
                                assetAmount: new Amount(2),
                                coreAmount: new Amount(1),
                                signingAccount: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
                                extrinsic: ADD_LIQUIDITY,
                            },
                        },
                    },
                });

                const output$ = clearTxFeeEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Liquidity.TRANSACTION_FEE_UPDATE,
                        payload: undefined,
                    },
                });
            });
        });
    });
});
