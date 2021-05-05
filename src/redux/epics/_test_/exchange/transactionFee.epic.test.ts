import {StateObservable} from 'redux-observable';
import {Amount} from '../../../../util/Amount';
import {
    requestTransactionFee,
    updateFromAssetAmount,
    updateToAssetAmount,
    swapAsset,
    updateExtrinsic,
    updateSelectedFromAsset,
    updateSelectedToAsset,
} from '../../../actions/ui/exchange.action';
import types from '../../../actions';
import {TestScheduler} from 'rxjs/testing';
import {Observable, of, Subject} from 'rxjs/index';
import {IEpicDependency} from '../../../../typings';
import {AppState} from '../../../reducers';
import {prepareExchangeExtrinsicParamsWithBuffer, SWAP_INPUT} from '../../../../util/extrinsicUtil';
import {prepareTransactionFeeEpic, requestTransactionFeeEpic} from '../../exchange/transactionFee.epic';

describe('Prepare transaction paramater epic working', () => {
    const triggers = [requestTransactionFee()];
    const [fromAsset, toAsset, fromAssetAmount, toAssetAmount, buffer] = [
        16000,
        16001,
        new Amount(2),
        new Amount(1),
        0.05,
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
                        exchange: {
                            form: {
                                fromAsset: fromAsset,
                                toAsset: toAsset,
                                fromAssetAmount: fromAssetAmount,
                                toAssetAmount: toAssetAmount,
                                extrinsic: SWAP_INPUT,
                                buffer: buffer,
                            },
                        },
                    },
                });
                const paramList = prepareExchangeExtrinsicParamsWithBuffer(SWAP_INPUT, {
                    fromAsset,
                    toAsset,
                    toAssetAmount,
                    fromAssetAmount,
                    buffer,
                });
                const output$ = prepareTransactionFeeEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Exchange.TRANSACTION_FEE_PARAMS_UPDATE,
                        payload: paramList,
                    },
                });
            });
        });
    });
});

describe('Request transaction fee epic working', () => {
    const amount = new Amount('2');
    const triggers = [
        updateFromAssetAmount(amount),
        updateToAssetAmount(amount),
        updateSelectedFromAsset(16000),
        updateSelectedToAsset(16001),
        swapAsset(),
        updateExtrinsic(SWAP_INPUT),
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

                const output$ = requestTransactionFeeEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Exchange.TRANSACTION_FEE_REQUEST,
                    },
                });
            });
        });
    });
});
