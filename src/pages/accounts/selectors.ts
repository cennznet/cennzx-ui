import React from 'react';
import {createSelector} from 'reselect';
import {AppState} from '../../redux/reducers';
import {Asset, IAssetBalance, IExchangePool} from '../../typings';
import {Amount} from '../../util/Amount';
//import {DECIMALS} from './send';
import {getAsset} from '../../util/assets';
import {keyExtractSuri, mnemonicGenerate, mnemonicValidate, randomAsU8a} from '@polkadot/util-crypto';

const getBuffer = (state: AppState) => state.ui.send.form.buffer;
const getToAsset = (state: AppState) => state.ui.send.form.toAsset;
const getSigningAccount = (state: AppState) => state.ui.send.form.signingAccount;
const getFromAsset = (state: AppState) => state.ui.send.form.fromAsset;
const getToAssetAmount = (state: AppState) => state.ui.send.form.toAssetAmount;
const getFromAssetAmount = (state: AppState) => state.ui.send.form.fromAssetAmount;
const getExchangePool = (state: AppState) => state.ui.send.exchangePool;
const getExchangeRate = (state: AppState) => state.ui.send.exchangeRate;
const getTxFee = (state: AppState) => state.ui.send.txFee;
const getFeeAssetId = (state: AppState) => state.ui.send.form.feeAssetId;
const getCoreAsset = (state: AppState) => state.global.coreAsset;
const getUserAssetBalance = (state: AppState) => state.ui.send.userAssetBalance;
export const getAssets = () => (typeof window !== 'undefined' ? window.config.ASSETS : []);
const getGenesisHash = (state: AppState) => state.global.genesisHash;
// console.log('getGenesisHash::',getGenesisHash);
export const getFromAssetUserBalance = createSelector(
    [getFromAsset, getUserAssetBalance, getSigningAccount],
    (fromAsset, userBalance, signingAccount) => {
        if (!fromAsset) return null;
        if (!userBalance.length) return null;
        const fromAssetBalance = userBalance.find(
            (bal: IAssetBalance) => bal.assetId === fromAsset && bal.account === signingAccount
        );
        if (fromAssetBalance) {
            return fromAssetBalance.balance;
        }
        return null;
    }
);

export const getOutputReserve = createSelector(
    [getToAsset, getExchangePool, getCoreAsset],
    (toAsset, exchangePool, coreAsset) => {
        if (!toAsset) return null;
        if (!exchangePool.length) return null;
        const poolBalanceForBuyAsset = exchangePool.find((poolData: IExchangePool) => poolData.assetId === toAsset);
        if (poolBalanceForBuyAsset) {
            return poolBalanceForBuyAsset.assetBalance;
        } else if (toAsset.toString() === coreAsset.toString()) {
            return exchangePool[0].coreAssetBalance; // core asset is selected as TO asset.
        }
    }
);

const getOptionByValue = (options: Asset[], valueOfSelectedItem: number) =>
    options ? options.find(item => item.id === valueOfSelectedItem) || null : null;

// export const getExchangeRateMsg = createSelector(
//     [getExchangeRate, getAssets, getFromAsset, getToAsset, getTxFee, getCoreAsset, getFeeAssetId, getFromAssetAmount],
//     (exchangeRate, assets, fromAsset, toAsset, txFee, coreAsset, feeAssetId, fromeAmount) => {
//         if (!fromeAmount || !exchangeRate) return;
//         let fee;
//         const assetSymbol = getAsset(feeAssetId).symbol;
//         if (coreAsset && coreAsset.eqn && coreAsset.eqn(feeAssetId) && txFee) {
//             fee = `${txFee.feeInCpay.asString(DECIMALS)} ${assetSymbol}`;
//         } else if (txFee && txFee.feeInFeeAsset) {
//             fee = `${txFee.feeInFeeAsset.asString(DECIMALS)} (converted to ${txFee.feeInCpay.asString(DECIMALS)} CPAY)`;
//         }
//         let rate = +exchangeRate.asString(DECIMALS) / +fromeAmount.asString();
//         rate = Math.round(rate * 10000) / 10000;
//         return `Exchange rate: 1 ${getOptionByValue(assets, fromAsset).symbol} = ${rate} ${
//             getOptionByValue(assets, toAsset).symbol
//         }. Transaction fee (estimated) : ${fee}`;
//     }
// );

export const getTxFeeMessage = createSelector(
    [getTxFee, getAssets, getFeeAssetId, getCoreAsset],
    (txFee, assets, feeAssetId, coreAsset) => {
        let fee;
        if (feeAssetId.toString() === coreAsset.toString() && txFee) {
            // If fee asset is CPAY use cpayFee
            fee = txFee.feeInCpay.asString(DECIMALS, Amount.ROUND_UP);
            return `Transaction fee is ${fee} ${getOptionByValue(assets, feeAssetId).symbol}`;
        } else if (txFee && txFee.feeInFeeAsset) {
            fee = txFee.feeInFeeAsset.asString(DECIMALS, Amount.ROUND_UP);
            return `Transaction fee is ${fee} ${
                getOptionByValue(assets, feeAssetId).symbol
            } (converted to ${txFee.feeInCpay.asString(DECIMALS, Amount.ROUND_UP)} CPAY)`;
        }
    }
);
