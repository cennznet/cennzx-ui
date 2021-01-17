import React from 'react';
import {createSelector} from 'reselect';
import {AppState} from '../../redux/reducers';
import {Asset, IAssetBalance, IExchangePool} from '../../typings';
import {Amount} from '../../util/Amount';
import {DECIMALS} from './liquidity';
import {getAsset} from '../../util/assets';

const getBuffer = (state: AppState) => state.ui.liquidity.form.buffer;
const getAdd1Asset = (state: AppState) => state.ui.liquidity.form.add1Asset;
const getAdd2Asset = (state: AppState) => state.ui.liquidity.form.add2Asset;
const getSigningAccount = (state: AppState) => state.ui.liquidity.form.signingAccount;
const getFromAsset = (state: AppState) => state.ui.liquidity.form.fromAsset;
const getToAssetAmount = (state: AppState) => state.ui.liquidity.form.toAssetAmount;
const getAdd2Amount = (state: AppState) => state.ui.liquidity.form.add2Amount;
const getFromAssetAmount = (state: AppState) => state.ui.liquidity.form.fromAssetAmount;
const getExchangePool = (state: AppState) => state.ui.liquidity.exchangePool;
const getExchangeRate = (state: AppState) => state.ui.liquidity.exchangeRate;
const getTxFee = (state: AppState) => state.ui.liquidity.txFee;
const getFeeAssetId = (state: AppState) => state.ui.liquidity.form.feeAssetId;
const getCoreAsset = (state: AppState) => state.global.coreAsset;
const getUserAssetBalance = (state: AppState) => state.ui.liquidity.userAssetBalance;
export const getAssets = () => (typeof window !== 'undefined' ? window.config.ASSETS : []);

// export const getFromAssetUserBalance = createSelector(
//     [getFromAsset, getUserAssetBalance, getSigningAccount],
//     (fromAsset, userBalance, signingAccount) => {
//         if (!fromAsset) return null;
//         if (!userBalance.length) return null;
//         const fromAssetBalance = userBalance.find(
//             (bal: IAssetBalance) => bal.assetId === fromAsset && bal.account === signingAccount
//         );
//         if (fromAssetBalance) {
//             return fromAssetBalance.balance;
//         }
//         return null;
//     }
// );

export const getAdd1AssetUserBalance = createSelector(
    [getAdd1Asset, getUserAssetBalance, getSigningAccount],
    (add1Asset, userBalance, signingAccount) => {
        if (!add1Asset) return null;
        if (!userBalance.length) return null;
        const fromAssetBalance = userBalance.find(
            (bal: IAssetBalance) => bal.assetId === add1Asset && bal.account === signingAccount
        );
        if (fromAssetBalance) {
            return fromAssetBalance.balance;
        }
        return null;
    }
);

export const getCoreAssetUserBalance = createSelector(
    [getCoreAsset, getUserAssetBalance, getSigningAccount],
    (coreAsset, userBalance, signingAccount) => {
        if (!coreAsset) return null;
        const coreAssetId = +coreAsset.toString();
        if (!userBalance.length) return null;
        const coreAssetBalance = userBalance.find(
            (bal: IAssetBalance) => bal.assetId === coreAssetId && bal.account === signingAccount
        );
        if (coreAssetBalance) {
            return coreAssetBalance.balance;
        }
        return null;
    }
);

export const getAdd1Reserve = createSelector(
    [getAdd1Asset, getExchangePool, getCoreAsset],
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

export const getCoreAssetBalance = createSelector(
    [getExchangePool],
    exchangePool => {
        if (!exchangePool.length) return null;
        return exchangePool[0].coreAssetBalance;
    }
);

const getOptionByValue = (options: Asset[], valueOfSelectedItem: number) =>
    options ? options.find(item => item.id === valueOfSelectedItem) || null : null;

export const getExchangeRateMsg = createSelector(
    [getExchangeRate, getAssets, getAdd2Asset, getAdd1Asset, getAdd2Amount],
    (exchangeRate, assets, add2Asset, toAsset, add2Amount) => {
        if (!add2Amount || !exchangeRate) return;
        let rate = +exchangeRate.asString(DECIMALS) / +add2Amount.asString();
        rate = Math.round(rate * 10000) / 10000;
        return exchangeRate
            ? `Exchange rate: 1 ${getOptionByValue(assets, add2Asset).symbol} = ${rate} ${
                  getOptionByValue(assets, toAsset).symbol
              }.`
            : '';
    }
);
export const getFee = createSelector(
    [getTxFee, getCoreAsset, getFeeAssetId],
    (txFee, coreAsset, feeAssetId) => {
        let fee;
        const assetSymbol = getAsset(feeAssetId).symbol;
        if (coreAsset && coreAsset.eqn && coreAsset.eqn(feeAssetId) && txFee) {
            fee = `${txFee.feeInCpay.asString(DECIMALS)} ${assetSymbol}`;
        } else if (txFee && txFee.feeInFeeAsset) {
            fee = `${txFee.feeInFeeAsset.asString(DECIMALS)} (converted to ${txFee.feeInCpay.asString(DECIMALS)} CPAY)`;
        }
        return fee;
    }
);

export const getTxFeeMessage = createSelector(
    [getTxFee, getAssets, getFeeAssetId, getCoreAsset],
    (txFee, assets, feeAssetId, coreAsset) => {
        let fee;
        if (String(feeAssetId) === String(coreAsset) && txFee) {
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
