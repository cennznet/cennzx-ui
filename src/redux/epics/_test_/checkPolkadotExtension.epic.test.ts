import {StateObservable} from 'redux-observable';
import {Observable, ReplaySubject, Subject, of, EMPTY} from 'rxjs';
import {take} from 'rxjs/operators';
import types from '../../actions';
import {updateExAccounts, updateExDetected} from '../../actions/extension.action';
import {AppState} from '../../reducers';
import {Injected, InjectedAccounts} from '@polkadot/extension-inject/types';
import {Signer as InjectedSigner} from '@polkadot/api/types';
import {web3Enable} from '@polkadot/extension-dapp';
import {extensionDetectedEpic, observableAccountsEpic, updateSelectedAccountEpic} from '../checkPolkadotExtension.epic';
import {createAction} from 'redux-actions';
import {TestScheduler} from 'rxjs/testing';
import {IEpicDependency} from '../../../typings';

jest.mock('@polkadot/extension-dapp', () => ({
    web3Enable: jest.fn(),
}));

const accounts$ = new ReplaySubject<any>(1);
const account = [
    {
        name: 'Account 1',
        meta: {name: 'Account 1'},
        address: '5GDq1kEpNzxWQcnviMRFnp1y8m47kWC1EDEUzgCZQFc4G1Df',
    },
];
accounts$.next(account);

describe('trigger on init, cennznet and polkadot extension detected - use cennznet extension', () => {
    const web3EnableMocked = web3Enable as any;
    const fakeJsInjectedExtension = [
        {
            name: 'cennznet-extension',
            version: '1.1.1',
            accounts: (accounts$ as unknown) as InjectedAccounts,
            signer: ({
                sign: async (t, n, e) => {
                    return 1;
                },
            } as unknown) as InjectedSigner,
        },
        {
            name: 'polkadot-js',
            version: '1.1.0',
            accounts: (accounts$ as unknown) as InjectedAccounts,
            signer: ({
                sign: async (t, n, e) => {
                    return 1;
                },
            } as unknown) as InjectedSigner,
        },
    ];

    web3EnableMocked.mockImplementation(() => [fakeJsInjectedExtension]);
    if (typeof window !== 'undefined') {
        window.injectedWeb3 = {
            ['cennznet-extension']: {
                version: '1.1.1',
                enable: async (): Promise<Injected> => {
                    return fakeJsInjectedExtension[0];
                },
            },
        };
    }

    const initAction = createAction(types.GlobalActions.INIT_APP);
    const triggers = [initAction()];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual[0]).toEqual(expected[0]);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_ = '-a-';
                // prettier-ignore
                const expect_ = '501ms c|';

                const action$ = hot(action_, {
                    a: action,
                });

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    extension: {
                        extensionDetected: false,
                        extensionConnected: false,
                        accounts: [],
                    },
                });

                const output$ = extensionDetectedEpic(action$, state$);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ExtensionActions.DETECTION_UPDATE,
                        payload: {
                            detected: true,
                            cennznetExtensionInjected: fakeJsInjectedExtension[0],
                        },
                    },
                });
            });
        });
    });
});

describe('trigger on detected, extension connected and accounts update', () => {
    const injectedWeb3 = {
        version: 'A',
        name: 'polkadot-js',
        accounts: (accounts$ as unknown) as InjectedAccounts,
        signer: ({
            sign: async (t, n, e) => {
                return 1;
            },
        } as unknown) as InjectedSigner,
    };
    const triggers = [updateExDetected(true, injectedWeb3)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(async ({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_ = '-a-';
                // prettier-ignore
                const expect_ = '-(c,d)-';
                //  const expect__ = '-c-';

                const action$ = hot(action_, {
                    a: action,
                });

                const output$ = await observableAccountsEpic(action$).pipe(take(1));
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ExtensionActions.CONNECTION_UPDATE,
                        payload: true,
                    },
                    d: {
                        type: types.ExtensionActions.ACCOUNTS_UPDATE,
                        payload: account,
                    },
                });
            });
        });
    });
});

describe('Extension detection completed works', () => {
    const triggers = [updateExAccounts(account)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const expect_                   = '-(cd)-';

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
                    ui: {},
                    extension: {
                        extensionDetected: false,
                        extensionConnected: false,
                        accounts: account,
                    },
                });

                const output$ = updateSelectedAccountEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Liquidity.SELECTED_ACCOUNT_UPDATE,
                        payload: account[0].address,
                    },
                    d: {
                        type: types.ui.Exchange.SELECTED_ACCOUNT_UPDATE,
                        payload: account[0].address,
                    },
                });
            });
        });
    });
});
