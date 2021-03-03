import React from 'react';
import {createSelector} from 'reselect';
import {AppState} from '../../redux/reducers';
import {Asset, IAssetBalance, IExchangePool} from '../../typings';
import {Amount} from '../../util/Amount';
import {DECIMALS} from './liquidity';
import {getAsset as getAsset_} from '../../util/assets';

const getBuffer = (state: AppState) => state.ui.liquidity.form.buffer;
const getAsset = (state: AppState) => state.ui.liquidity.form.asset;
const getSigningAccount = (state: AppState) => state.ui.liquidity.form.signingAccount;
const getAssetAmount = (state: AppState) => state.ui.liquidity.form.assetAmount;
const getCoreAmount = (state: AppState) => state.ui.liquidity.form.coreAmount;
const getExchangePool = (state: AppState) => state.ui.liquidity.exchangePool;
const getExchangeRate = (state: AppState) => state.ui.liquidity.exchangeRate;
const getTxFee = (state: AppState) => state.ui.liquidity.txFee;
const getFeeAssetId = (state: AppState) => state.ui.liquidity.form.feeAssetId;
const getCoreAsset = (state: AppState) => state.global.coreAsset;
const getUserAssetBalance = (state: AppState) => state.ui.liquidity.userAssetBalance;

export const getAssets = () => (typeof window !== 'undefined' ? window.config.ASSETS : []);

// always fixed to CPAY
export const getLiquidityExchangeRate = createSelector(
    [getAsset, getAssetAmount, getCoreAsset],
    (asset, add1Amount, getCoreAsset) => {}
);

export const getAccountAssetBalance = createSelector(
    [getAsset, getUserAssetBalance, getSigningAccount],
    (asset, userBalance, signingAccount) => {
        if (!asset) return null;
        if (!userBalance.length) return null;
        const fromAssetBalance = userBalance.find(
            (bal: IAssetBalance) => bal.assetId === asset && bal.account === signingAccount
        );
        if (fromAssetBalance) {
            return fromAssetBalance.balance;
        }
        return null;
    }
);

export const getAccountCoreBalance = createSelector(
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

export const getAssetReserve = createSelector(
    [getAsset, getExchangePool, getCoreAsset],
    (asset, exchangePool, coreAsset) => {
        if (!asset) return null;
        if (!exchangePool.length) return null;
        const poolBalanceForBuyAsset = exchangePool.find((poolData: IExchangePool) => poolData.assetId === asset);
        if (poolBalanceForBuyAsset) {
            return poolBalanceForBuyAsset.assetBalance;
        } else if (asset.toString() === coreAsset.toString()) {
            return exchangePool[0].coreAssetBalance; // core asset is selected as TO asset.
        }
    }
);

export const getCoreReserve = createSelector(
    [getExchangePool],
    exchangePool => {
        if (!exchangePool.length) return null;
        return exchangePool[0].coreAssetBalance;
    }
);

const getOptionByValue = (options: Asset[], valueOfSelectedItem: number) =>
    options ? options.find(item => item.id === valueOfSelectedItem) || null : null;

export const getExchangeRateMsg = createSelector(
    [getExchangeRate, getAssets, getCoreAsset, getAsset, getCoreAmount],
    (exchangeRate, assets, coreAsset, asset, coreAmount) => {
        if (!coreAmount || !exchangeRate) return;
        let rate = +exchangeRate.asString(DECIMALS) / +coreAmount.asString();
        rate = Math.round(rate * 10000) / 10000;
        return exchangeRate
            ? `Exchange rate: 1 ${getOptionByValue(assets, coreAsset).symbol} = ${rate} ${
                  getOptionByValue(assets, asset).symbol
              }.`
            : '';
    }
);
export const getFee = createSelector(
    [getTxFee, getCoreAsset, getFeeAssetId],
    (txFee, coreAsset, feeAssetId) => {
        let fee;
        const assetSymbol = getAsset_(feeAssetId).symbol;
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
