import {StateObservable} from 'redux-observable';
import {Observable, Subject} from 'rxjs';
import {ReplaySubject} from 'rxjs';
import types from '../../../actions';
import {AppState} from '../../../reducers';
import {getInputPriceEpic, getOutputPriceEpic} from '../../exchange/price.epic';
import {TestScheduler} from 'rxjs/testing';
import {IEpicDependency} from '../../../../typings';
import {setFromAssetAmount, setToAssetAmount} from '../../../actions/ui/exchange.action';
import {Amount, AmountUnit} from '../../../../util/Amount';
import {of} from 'rxjs/index';
import BN from 'bn.js';
import {throwError} from 'rxjs/internal/observable/throwError';
import {AmountExceedsPoolBalance, NodeConnectionTimeOut} from '../../../../error/error';

const accounts$ = new ReplaySubject<any>(1);
const account = [
    {
        name: 'Account 1',
        address: '5GDq1kEpNzxWQcnviMRFnp1y8m47kWC1EDEUzgCZQFc4G1Df',
    },
];
accounts$.next(account);

const globalAssetList = new Array();
globalAssetList[16000] = {decimalPlaces: 4, symbol: 'CENNZ', id: 16000};
globalAssetList[16001] = {decimalPlaces: 4, symbol: 'CPAY', id: 16001};

describe('trigger on check input price epic works', () => {
    const inputAmount = new Amount('1', AmountUnit.DISPLAY);
    const triggers = [setFromAssetAmount(inputAmount)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
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

                const inputPrice = {
                    price: new BN('2200000'),
                };

                const api$ = of({
                    rpc: {
                        cennzx: {
                            sellPrice: () =>
                                cold(getInputPrice, {
                                    b: inputPrice,
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
                            form: {
                                fromAsset: 16000,
                                toAsset: 16001,
                                fromAssetAmount: 1,
                            },
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getInputPriceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Exchange.TO_ASSET_AMOUNT_UPDATE,
                        payload: new Amount('2200000'),
                    },
                });
            });
        });
    });
});

describe('Update the input price to a different value', () => {
    const inputAmount = new Amount('1', AmountUnit.DISPLAY);
    const triggers = [setFromAssetAmount(inputAmount)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
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

                const inputPrice = {
                    price: new BN('2200000'),
                };

                const api$ = of({
                    rpc: {
                        cennzx: {
                            sellPrice: () =>
                                cold(getInputPrice, {
                                    b: inputPrice,
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
                            form: {
                                fromAsset: 16000,
                                toAsset: 16001,
                                fromAssetAmount: new Amount(1),
                                toAssetAmount: new Amount(3),
                            },
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getInputPriceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Exchange.TO_ASSET_AMOUNT_UPDATE,
                        payload: new Amount('2200000'),
                    },
                });
            });
        });
    });
});

describe('Test when output price epic throws pool balance low error, should return empty', () => {
    const inputAmount = new Amount('2', AmountUnit.DISPLAY);
    const triggers = [setToAssetAmount(inputAmount)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
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
                    rpc: {
                        cennzx: {
                            buyPrice: () => throwError(new Error('Pool balance is low')),
                        },
                    },
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
                                fromAssetAmount: new Amount(1),
                                toAssetAmount: new Amount(3),
                            },
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getOutputPriceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_);
            });
        });
    });
});

describe('Test when input price epic throws pool balance low error, should return empty', () => {
    const inputAmount = new Amount('2', AmountUnit.DISPLAY);
    const triggers = [setFromAssetAmount(inputAmount)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
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
                    rpc: {
                        cennzx: {
                            sellPrice: () => throwError(new Error('Pool balance is low')),
                        },
                    },
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
                                fromAssetAmount: new Amount(1),
                                toAssetAmount: new Amount(3),
                            },
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getInputPriceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_);
            });
        });
    });
});

describe('Test when error already reported for sell price, should return empty', () => {
    const inputAmount = new Amount('2', AmountUnit.DISPLAY);
    const triggers = [setFromAssetAmount(inputAmount)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
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

                const err = new Error('2: Cannot exchange by requested amount.: ');

                const api$ = of({
                    rpc: {
                        cennzx: {
                            sellPrice: () => throwError(err),
                        },
                    },
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
                                fromAssetAmount: new Amount(1),
                                toAssetAmount: new Amount(3),
                            },
                            error: [err],
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getInputPriceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_);
            });
        });
    });
});

describe('Test when error already reported for buy price, should return empty', () => {
    const inputAmount = new Amount('2', AmountUnit.DISPLAY);
    const triggers = [setToAssetAmount(inputAmount)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
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

                const err = new Error('2: Cannot exchange for requested amount.: ');

                const api$ = of({
                    rpc: {
                        cennzx: {
                            buyPrice: () => throwError(err),
                        },
                    },
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
                                fromAssetAmount: new Amount(1),
                                toAssetAmount: new Amount(3),
                            },
                            error: [err],
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getOutputPriceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_);
            });
        });
    });
});

describe('Test when input price epic throws', () => {
    const inputAmount = new Amount('2', AmountUnit.DISPLAY);
    const triggers = [setFromAssetAmount(inputAmount)];
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

                const err = new NodeConnectionTimeOut();
                const api$ = of({
                    rpc: {
                        cennzx: {
                            sellPrice: () => throwError(err),
                        },
                    },
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
                                fromAssetAmount: new Amount(1),
                                toAssetAmount: new Amount(3),
                            },
                            error: [],
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getInputPriceEpic(action$, state$, dependencies);
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

describe('Update the output price to a different value', () => {
    const inputAmount = new Amount('2', AmountUnit.DISPLAY);
    const triggers = [setToAssetAmount(inputAmount)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const getOutputPrice            = ' -b-';
                // prettier-ignore
                const expect_                   = '--c';

                const action$ = hot(action_, {
                    a: action,
                });

                const outPrice = {
                    price: new BN('43200'),
                };

                const api$ = of({
                    rpc: {
                        cennzx: {
                            buyPrice: () =>
                                cold(getOutputPrice, {
                                    b: outPrice,
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
                            form: {
                                fromAsset: 16000,
                                toAsset: 16001,
                                toAssetAmount: 2,
                            },
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getOutputPriceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Exchange.FROM_ASSET_AMOUNT_UPDATE,
                        payload: new Amount('43200'),
                    },
                });
            });
        });
    });
});

describe('trigger on check output price epic works', () => {
    const inputAmount = new Amount('2', AmountUnit.DISPLAY);
    const triggers = [setToAssetAmount(inputAmount)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const getOutputPrice            = ' -b-';
                // prettier-ignore
                const expect_                   = '--c';

                const action$ = hot(action_, {
                    a: action,
                });

                const outPrice = {
                    price: new BN('43200'),
                };

                const api$ = of({
                    rpc: {
                        cennzx: {
                            buyPrice: () =>
                                cold(getOutputPrice, {
                                    b: outPrice,
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
                            form: {
                                fromAsset: 16000,
                                toAsset: 16001,
                                fromAssetAmount: new Amount(1),
                                toAssetAmount: new Amount(3),
                            },
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getOutputPriceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Exchange.FROM_ASSET_AMOUNT_UPDATE,
                        payload: new Amount('43200'),
                    },
                });
            });
        });
    });
});

describe('Test when output price epic throws', () => {
    const inputAmount = new Amount('2', AmountUnit.DISPLAY);
    const triggers = [setToAssetAmount(inputAmount)];
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

                const err = new NodeConnectionTimeOut();

                const api$ = of({
                    rpc: {
                        cennzx: {
                            buyPrice: () => throwError(err),
                        },
                    },
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
                                fromAssetAmount: new Amount(1),
                                toAssetAmount: new Amount(3),
                            },
                            error: [],
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getOutputPriceEpic(action$, state$, dependencies);
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

describe('Test when output price epic throws', () => {
    const inputAmount = new Amount('2', AmountUnit.DISPLAY);
    const triggers = [setToAssetAmount(inputAmount)];
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

                const err = new NodeConnectionTimeOut();

                const api$ = of({
                    rpc: {
                        cennzx: {
                            buyPrice: () => throwError(err),
                        },
                    },
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
                                fromAssetAmount: new Amount(1),
                                toAssetAmount: new Amount(3),
                            },
                            error: [],
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getOutputPriceEpic(action$, state$, dependencies);
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

describe('Test when output price epic throws "Cannot exchange by requested amount" error', () => {
    const outputAmount = new Amount('2', AmountUnit.DISPLAY);
    const triggers = [setToAssetAmount(outputAmount)];
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

                const err = new Error('2: Cannot exchange for requested amount.: ');

                const api$ = of({
                    rpc: {
                        cennzx: {
                            buyPrice: () => throwError(err),
                        },
                    },
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
                                fromAssetAmount: new Amount(1),
                                toAssetAmount: new Amount(3),
                            },
                            error: [],
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getOutputPriceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        error: true,
                        type: types.ui.Exchange.ERROR_SET,
                        payload: new Error('Buy price cannot be calculated, issue with the requested amount'),
                    },
                });
            });
        });
    });
});

describe('Test when input price epic throws "Cannot exchange by requested amount" error', () => {
    const outputAmount = new Amount('2', AmountUnit.DISPLAY);
    const triggers = [setFromAssetAmount(outputAmount)];
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

                const err = new Error('2: Cannot exchange by requested amount.: ');

                const api$ = of({
                    rpc: {
                        cennzx: {
                            sellPrice: () => throwError(err),
                        },
                    },
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
                                fromAssetAmount: new Amount(1),
                                toAssetAmount: new Amount(3),
                            },
                            error: [],
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getInputPriceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        error: true,
                        type: types.ui.Exchange.ERROR_SET,
                        payload: new Error('Sell price cannot be calculated, issue with the requested amount'),
                    },
                });
            });
        });
    });
});
