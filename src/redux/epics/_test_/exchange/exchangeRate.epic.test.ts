import {StateObservable} from 'redux-observable';
import {Observable, Subject} from 'rxjs';
import {ReplaySubject} from 'rxjs';
import types from '../../../actions';
import {AppState} from '../../../reducers';
import {getInputPriceEpic, getOutputPriceEpic} from '../../exchange/price.epic';
import {TestScheduler} from 'rxjs/testing';
import {IEpicDependency} from '../../../../typings';
import {
    requestExchangeRate,
    setFromAssetAmount,
    setToAssetAmount,
    swapAsset,
    updateSelectedFromAsset,
    updateSelectedToAsset,
} from '../../../actions/ui/exchange.action';
import {Amount, AmountUnit} from '../../../../util/Amount';
import {of} from 'rxjs/index';
import BN from 'bn.js';
import {throwError} from 'rxjs/internal/observable/throwError';
import {AmountExceedsPoolBalance, NodeConnectionTimeOut} from '../../../../error/error';
import {getExchangeRateEpic, requestExchangeRateEpic} from '../../exchange/exchangeRate.epic';
import {EMPTY} from 'rxjs/internal/observable/empty';

const accounts$ = new ReplaySubject<any>(1);
const account = [
    {
        name: 'Account 1',
        address: '5GDq1kEpNzxWQcnviMRFnp1y8m47kWC1EDEUzgCZQFc4G1Df',
    },
];
accounts$.next(account);

describe('Get exchange rate working', () => {
    const triggers = [requestExchangeRate()];
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
                const getInputPrice            = ' -b-';
                // prettier-ignore
                const expect_                   = '--c';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    cennzx: {
                        getInputPrice: () =>
                            cold(getInputPrice, {
                                b: new BN('22'),
                            }),
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    extension: {
                        extensionDetected: false,
                        extensionConnected: false,
                        accounts: [],
                    },
                    ui: {
                        exchange: {
                            form: {
                                fromAsset: 16000,
                                toAsset: 16001,
                            },
                        },
                    },
                });

                const output$ = getExchangeRateEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Exchange.EXCHANGE_RATE_UPDATE,
                        payload: new Amount('22'),
                    },
                });
            });
        });
    });
});

describe('Update the exchange rate to a different value', () => {
    const triggers = [requestExchangeRate()];
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
                const getInputPrice            = ' -b-';
                // prettier-ignore
                const expect_                   = '--c';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    cennzx: {
                        getInputPrice: () =>
                            cold(getInputPrice, {
                                b: new BN('2'),
                            }),
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    extension: {
                        extensionDetected: false,
                        extensionConnected: false,
                        accounts: [],
                    },
                    ui: {
                        exchange: {
                            form: {
                                fromAsset: 16000,
                                toAsset: 16001,
                            },
                            exchangeRate: new Amount(1),
                        },
                    },
                });

                const output$ = getExchangeRateEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Exchange.EXCHANGE_RATE_UPDATE,
                        payload: new Amount('2'),
                    },
                });
            });
        });
    });
});

describe('Test when exchange rate epic throws pool balance low error, should return empty', () => {
    const triggers = [requestExchangeRate()];
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
                    cennzx: {
                        getInputPrice: () => throwError(new Error('Pool balance is low')),
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    extension: {
                        extensionDetected: false,
                        extensionConnected: false,
                        accounts: [],
                    },
                    ui: {
                        exchange: {
                            form: {
                                fromAsset: 16000,
                                toAsset: 16001,
                            },
                        },
                    },
                });

                const output$ = getExchangeRateEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_);
            });
        });
    });
});

describe('Test when exchange rate epic throws error', () => {
    const triggers = [requestExchangeRate()];
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

                const err = new NodeConnectionTimeOut();
                const api$ = of({
                    cennzx: {
                        getInputPrice: () => throwError(err),
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    extension: {
                        extensionDetected: false,
                        extensionConnected: false,
                        accounts: [],
                    },
                    ui: {
                        exchange: {
                            form: {
                                fromAsset: 16000,
                                toAsset: 16001,
                            },
                        },
                    },
                });

                const output$ = getExchangeRateEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        error: true,
                        type: types.ui.Exchange.ERROR_SET,
                        payload: err,
                    },
                });
            });
        });
    });
});

describe('Request exchange rate working', () => {
    const inputAmount = new Amount('2');
    const triggers = [
        setFromAssetAmount(inputAmount),
        updateSelectedFromAsset(16000),
        updateSelectedToAsset(16001),
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
                            },
                        },
                    },
                });

                const output$ = requestExchangeRateEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Exchange.EXCHANGE_RATE_REQUEST,
                    },
                });
            });
        });
    });
});
