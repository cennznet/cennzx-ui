import BN from 'bn.js';
import {StateObservable} from 'redux-observable';
import {Observable, of, Subject} from 'rxjs';
import {TestScheduler} from 'rxjs/testing';
import {IEpicDependency} from '../../../../typings';
import types from '../../../actions';
import {AppState} from '../../../reducers';
import {EMPTY} from 'rxjs/internal/observable/empty';
import {Amount} from '../../../../util/Amount';
import {Hash, ISubmittableResult} from '@cennznet/types';
import {updateTxFeeParameter} from '../../../actions/ui/liquidity.action';
import {ADD_LIQUIDITY} from '../../../../util/extrinsicUtil';
import {calculateTxFeeEpic} from '../../liquidity/calculateFee.epic';
import {SubmittableExtrinsic} from '@cennznet/api/types';

describe('Calculate Tx Fee when fee asset is CPAY', () => {
    const paramList = [16000, 160001, new Amount(1), new Amount(3)];
    const triggers = [updateTxFeeParameter(paramList)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                // somehow assert the two objects are equal
                // e.g. with chai `expect(actual).deep.equal(expected)`
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_ =      '-a-';
                // prettier-ignore
                const expect_ =      '-c-';
                const action$ = hot(action_, {
                    a: action,
                });

                const tx: SubmittableExtrinsic<'rxjs', ISubmittableResult> = {
                    fee(address: string): Observable<BN> {
                        return of(new BN('1'));
                    },
                } as any;

                const api$ = of({
                    tx: {
                        cennzx: {
                            addLiquidity: () => tx,
                        },
                    },
                    derive: {
                        fees: {
                            estimateFee(): Observable<BN> {
                                return of(new BN(1230));
                            },
                        },
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;
                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        liquidity: {
                            form: {
                                assetId: 16000,
                                toAsset: 16001,
                                feeAssetId: 16001,
                                extrinsic: ADD_LIQUIDITY,
                                coreAmount: new Amount(1),
                                assetAmount: new Amount(3),
                                buffer: 0.05,
                            },
                            extrinsicParams: paramList,
                            txFee: {feeInCpay: new Amount(1), feeInFeeAsset: null},
                        },
                    },
                });

                const output$ = calculateTxFeeEpic(action$, state$, dependencies);

                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Liquidity.TRANSACTION_FEE_UPDATE,
                        payload: {feeInCpay: new Amount('1230'), feeInFeeAsset: new Amount('1230')},
                    },
                });
            });
        });
    });
});

describe('Calculate Tx Fee when fee asset is CPAY and it has not changed so Return EMPTY', () => {
    const paramList = [16000, 160001, new Amount(1), new Amount(3)];
    const triggers = [updateTxFeeParameter(paramList)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                // somehow assert the two objects are equal
                // e.g. with chai `expect(actual).deep.equal(expected)`
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_ =      '-a-';
                // prettier-ignore
                const expect_ =      '';
                const action$ = hot(action_, {
                    a: action,
                });

                const tx: SubmittableExtrinsic<'rxjs', ISubmittableResult> = {
                    fee(address: string): Observable<BN> {
                        return of(new BN('1'));
                    },
                } as any;

                const api$ = of({
                    tx: {
                        cennzx: {
                            addLiquidity: () => tx,
                        },
                    },
                    derive: {
                        fees: {
                            estimateFee(): Observable<BN> {
                                return of(new BN(1));
                            },
                        },
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;
                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        liquidity: {
                            form: {
                                assetId: 16000,
                                toAsset: 16001,
                                feeAssetId: 16001,
                                extrinsic: ADD_LIQUIDITY,
                                coreAmount: new Amount(1),
                                assetAmount: new Amount(3),
                                buffer: 0.05,
                            },
                            extrinsicParams: paramList,
                            txFee: {feeInCpay: new BN(1), feeInFeeAsset: new BN(1)},
                        },
                    },
                });
                const output$ = calculateTxFeeEpic(action$, state$, dependencies);

                expectObservable(output$).toBe(expect_);
            });
        });
    });
});

describe('Calculate Tx Fee when fee asset is CPAY and Fee asset as CENNZ', () => {
    const paramList = [16000, 160001, new Amount(1), new Amount(3)];
    const triggers = [updateTxFeeParameter(paramList)];
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
                const expect_                   = '-c-';
                const action$ = hot(action_, {
                    a: action,
                });

                const tx: SubmittableExtrinsic<'rxjs', ISubmittableResult> = {
                    fee(address: string): Observable<BN> {
                        return of(new BN('1'));
                    },
                } as any;

                const api$ = of({
                    tx: {
                        cennzx: {
                            addLiquidity: () => tx,
                        },
                    },
                    derive: {
                        fees: {
                            estimateFee(): Observable<BN> {
                                return of(new BN(43));
                            },
                        },
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;
                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        liquidity: {
                            form: {
                                assetId: 16000,
                                toAsset: 16001,
                                feeAssetId: 16001,
                                extrinsic: ADD_LIQUIDITY,
                                coreAmount: new Amount(1),
                                assetAmount: new Amount(3),
                                buffer: 0.05,
                            },
                            extrinsicParams: paramList,
                            txFee: {feeInCpay: new Amount(1), feeInFeeAsset: new Amount(2)},
                        },
                    },
                });
                const output$ = calculateTxFeeEpic(action$, state$, dependencies);

                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Liquidity.TRANSACTION_FEE_UPDATE,
                        payload: {feeInCpay: new Amount('43'), feeInFeeAsset: new Amount('43')},
                    },
                });
            });
        });
    });
});
