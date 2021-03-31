// Copyright 2019-2020 Centrality Investments Limited
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Api} from '@cennznet/api';
import Keyring from '@polkadot/keyring';
import BN from 'bn.js';

describe('e2e api create', () => {
    let api;

    it('Testing add liquidity when trade asset amount is provided and core asset amount is calculated', async done => {
        jest.setTimeout(80000);
        api = await Api.create();
        const CENNZ = 16000;
        const amount = 1000;
        const coreAmount = amount;
        const minLiquidity = 1;
        const keyring = new Keyring({type: 'sr25519'});
        const alice = keyring.addFromUri('//Alice');
        // Add Liquidity for the first time in the pool.
        await api.tx.cennzx
            .addLiquidity(CENNZ, minLiquidity, amount, coreAmount)
            .signAndSend(alice, async ({events, status}) => {
                if (status.isInBlock) {
                    const assetAmount = new BN(15);
                    const tradeAssetReserve = await api.derive.cennzx.poolAssetBalance(CENNZ);
                    const coreAssetReserve = await api.derive.cennzx.poolCoreAssetBalance(CENNZ);
                    const totalLiquidity = await api.derive.cennzx.totalLiquidity(CENNZ);
                    const coreAmountCal = assetAmount.mul(coreAssetReserve).div(tradeAssetReserve);
                    //  const coreAmountCalFalse = assetAmount.mul(coreAssetReserve).div(tradeAssetReserve).addn(1); --- results in test failure
                    // console.log('coreAmountCalFalse::',coreAmountCalFalse.toString());
                    const minLiquidityCal = coreAmountCal.mul(totalLiquidity.div(coreAssetReserve));
                    await api.tx.cennzx
                        .addLiquidity(CENNZ, minLiquidityCal, amount, coreAmountCal)
                        .signAndSend(alice, async ({events, status}) => {
                            if (status.isInBlock) {
                                for (const {event} of events) {
                                    if (event.method === 'AddLiquidity') {
                                        const [fromAccount, coreAmount, assetId, tradeAssetAmount] = event.data;
                                        expect(coreAmount.toString()).toEqual(coreAmountCal.toString());
                                        expect(assetAmount.toString()).toEqual(tradeAssetAmount.toString());
                                        done();
                                    }
                                }
                            }
                        });
                }
            });
    });
});
