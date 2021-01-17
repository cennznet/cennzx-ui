import {StateObservable} from 'redux-observable';
import {Amount} from '../../../../util/Amount';
import {
    swapAsset,
    setFromAssetAmount,
    updateSelectedFromAsset,
    updateSelectedToAsset,
    setToAssetAmount,
    setExchangeError,
    updateSelectedAccount,
} from '../../../actions/ui/exchange.action';
import {SWAP_INPUT} from '../../../../util/extrinsicUtil';
import types from '../../../actions';
import {TestScheduler} from 'rxjs/testing';
import {Observable, of, Subject} from 'rxjs/index';
import {IEpicDependency} from '../../../../typings';
import {AppState} from '../../../reducers';
import {
    clearAmountEpic,
    clearEstimatedAmountEpic,
    clearExchangeRateAmountEpic,
    clearTxFeeEpic,
} from '../../exchange/clearFields.epic';
import {EmptyPool} from '../../../../error/error';
import {getAsset} from '../../../../util/assets';

describe('Clear toAsset amount field when from asset is set', () => {
    const amount = new Amount('2');
    const triggers = [setFromAssetAmount(amount)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                // somehow assert the two objects are equal
                // e.g. with chai `expect(actual).deep.equal(expected)`
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
                                extrinsic: SWAP_INPUT,
                            },
                        },
                    },
                });

                const output$ = clearEstimatedAmountEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Exchange.TO_ASSET_AMOUNT_UPDATE,
                        payload: undefined,
                    },
                });
            });
        });
    });
});

describe('Clear fromAsset amount field when from asset is set', () => {
    const amount = new Amount('2');
    const triggers = [setToAssetAmount(amount)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                // somehow assert the two objects are equal
                // e.g. with chai `expect(actual).deep.equal(expected)`
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
                                extrinsic: SWAP_INPUT,
                            },
                        },
                    },
                });

                const output$ = clearEstimatedAmountEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Exchange.FROM_ASSET_AMOUNT_UPDATE,
                        payload: undefined,
                    },
                });
            });
        });
    });
});

describe('Clear fromAsset amount and toAssetAmount fields when from new buy/with asset is set', () => {
    const amount = new Amount('2');
    const triggers = [
        updateSelectedFromAsset(16000),
        //   updateSelectedToAsset(16001),
    ];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                // somehow assert the two objects are equal
                // e.g. with chai `expect(actual).deep.equal(expected)`
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const expect_                   = '-(cd)';

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
                                extrinsic: SWAP_INPUT,
                            },
                        },
                    },
                });

                const output$ = clearEstimatedAmountEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Exchange.FROM_ASSET_AMOUNT_UPDATE,
                        payload: undefined,
                    },
                    d: {
                        type: types.ui.Exchange.TO_ASSET_AMOUNT_UPDATE,
                        payload: undefined,
                    },
                });
            });
        });
    });
});

describe('Return empty when from new buy/with asset is set but extrinsic is not set', () => {
    const amount = new Amount('2');
    const triggers = [
        updateSelectedFromAsset(16000),
        //   updateSelectedToAsset(16001),
    ];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                // somehow assert the two objects are equal
                // e.g. with chai `expect(actual).deep.equal(expected)`
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const expect_                   = '';

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
                            },
                        },
                    },
                });

                const output$ = clearEstimatedAmountEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_);
            });
        });
    });
});

describe('Clear exchange rate when new buy/with asset is set or assets are swapped', () => {
    const amount = new Amount('2');
    const triggers = [updateSelectedFromAsset(16000), updateSelectedToAsset(16001), swapAsset()];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                // somehow assert the two objects are equal
                // e.g. with chai `expect(actual).deep.equal(expected)`
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
                                extrinsic: SWAP_INPUT,
                            },
                        },
                    },
                });

                const output$ = clearExchangeRateAmountEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Exchange.EXCHANGE_RATE_UPDATE,
                        payload: undefined,
                    },
                });
            });
        });
    });
});

describe('Clear buy/with asset amounts when asset pool is empty', () => {
    if (typeof window !== 'undefined') {
        window.config.ASSETS = [{symbol: 'CENNZ', id: 16000}, {symbol: 'CPAY', id: 16001}, {symbol: 'PLUG', id: 16003}];
    }
    const triggers = [setExchangeError(new EmptyPool(getAsset(16001)))];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                // somehow assert the two objects are equal
                // e.g. with chai `expect(actual).deep.equal(expected)`
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const expect_                   = '-(cd)';

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
                                extrinsic: SWAP_INPUT,
                            },
                        },
                    },
                });

                const output$ = clearAmountEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Exchange.TO_ASSET_AMOUNT_UPDATE,
                        payload: undefined,
                    },
                    d: {
                        type: types.ui.Exchange.FROM_ASSET_AMOUNT_UPDATE,
                        payload: undefined,
                    },
                });
            });
        });
    });
});

describe('Clear tx fee when new buy/with asset is set or assets are swapped or account is changed', () => {
    const amount = new Amount('2');
    const triggers = [
        updateSelectedFromAsset(16000),
        updateSelectedToAsset(16001),
        setFromAssetAmount(amount),
        setToAssetAmount(amount),
        updateSelectedAccount('sssss'),
        swapAsset(),
    ];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                // somehow assert the two objects are equal
                // e.g. with chai `expect(actual).deep.equal(expected)`
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
                                extrinsic: SWAP_INPUT,
                            },
                        },
                    },
                });

                const output$ = clearTxFeeEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Exchange.TRANSACTION_FEE_UPDATE,
                        payload: undefined,
                    },
                });
            });
        });
    });
});
