import React from 'react';
import {createSelector} from 'reselect';
import {AppState} from '../../redux/reducers';
import {Asset, IAssetBalance, IExchangePool} from '../../typings';
import {Amount} from '../../util/Amount';

const getBuffer = (state: AppState) => state.ui.exchange.form.buffer;
const getToAsset = (state: AppState) => state.ui.exchange.form.toAsset;
const getSigningAccount = (state: AppState) => state.ui.exchange.form.signingAccount;
const getFromAsset = (state: AppState) => state.ui.exchange.form.fromAsset;
const getToAssetAmount = (state: AppState) => state.ui.exchange.form.toAssetAmount;
const getFromAssetAmount = (state: AppState) => state.ui.exchange.form.fromAssetAmount;
const getExchangePool = (state: AppState) => state.ui.exchange.exchangePool;
const getExchangeRate = (state: AppState) => state.ui.exchange.exchangeRate;
const getTxFee = (state: AppState) => state.ui.exchange.txFee;
const getFeeAssetId = (state: AppState) => state.ui.exchange.form.feeAssetId;
const getCoreAsset = (state: AppState) => state.global.coreAssetId;
const getUserAssetBalance = (state: AppState) => state.ui.exchange.userAssetBalance;
const getAssetInfo = (state: AppState) => state.global.assetInfo;

export const getAssets = createSelector(
    [getAssetInfo],
    assetInfo => {
        const newAssetList = [];
        assetInfo &&
            assetInfo.forEach(asset => {
                const assetObject = {
                    symbol: asset.symbol,
                    id: asset.id,
                };
                newAssetList.push(assetObject);
            });
        return newAssetList;
    }
);

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

export const getToAssetUserBalance = createSelector(
    [getToAsset, getUserAssetBalance, getSigningAccount],
    (toAsset, userBalance, signingAccount) => {
        if (!toAsset) return null;
        if (!userBalance.length) return null;
        const toAssetBalance = userBalance.find(
            (bal: IAssetBalance) => bal.assetId === toAsset && bal.account === signingAccount
        );
        if (toAssetBalance) {
            return toAssetBalance.balance;
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
        } else if (String(toAsset) === String(coreAsset)) {
            return exchangePool[0].coreAssetBalance; // core asset is selected as TO asset.
        }
    }
);

const getOptionByValue = (options: Asset[], valueOfSelectedItem: number) =>
    options ? options.find(item => item.id === valueOfSelectedItem) || null : null;

export const getExchangeRateMsg = createSelector(
    [
        getExchangeRate,
        getAssets,
        getFromAsset,
        getToAsset,
        getTxFee,
        getCoreAsset,
        getFeeAssetId,
        getFromAssetAmount,
        getAssetInfo,
    ],
    (exchangeRate, assets, fromAsset, toAsset, txFee, coreAsset, feeAssetId, fromeAmount, assetInfo) => {
        if (!fromeAmount || !exchangeRate) return;
        let fee;
        const assetSymbol = assetInfo[feeAssetId].symbol;
        if (coreAsset && coreAsset === feeAssetId && txFee) {
            fee = `${txFee.feeInCpay.asString(assetInfo[feeAssetId].decimalPlaces)} ${assetSymbol}`;
        } else if (txFee && txFee.feeInFeeAsset) {
            fee = `${txFee.feeInFeeAsset.asString(
                assetInfo[feeAssetId].decimalPlaces
            )} (converted to ${txFee.feeInCpay.asString(assetInfo[coreAsset].decimalPlaces)} CPAY)`;
        }
        const feeString = fee ? `Transaction fee (estimated) : ${fee}` : '';

        const rate = exchangeRate.asString(assetInfo[toAsset].decimalPlaces);
        return exchangeRate
            ? `Exchange rate: 1 ${getOptionByValue(assets, fromAsset).symbol} = ${rate} ${
                  getOptionByValue(assets, toAsset).symbol
              }. ${feeString}`
            : '';
    }
);

export const getTxFeeMessage = createSelector(
    [getTxFee, getAssets, getFeeAssetId, getCoreAsset, getAssetInfo],
    (txFee, assets, feeAssetId, coreAsset, assetInfo) => {
        let fee;
        if (String(feeAssetId) === String(coreAsset) && txFee) {
            // If fee asset is CPAY use cpayFee
            fee = txFee.feeInCpay.asString(assetInfo[feeAssetId].decimalPlaces, Amount.ROUND_UP);
            return `Transaction fee is ${fee} ${getOptionByValue(assets, feeAssetId).symbol}`;
        } else if (txFee && txFee.feeInFeeAsset) {
            fee = txFee.feeInFeeAsset.asString(assetInfo[feeAssetId].decimalPlaces, Amount.ROUND_UP);
            return `Transaction fee is ${fee} ${
                getOptionByValue(assets, feeAssetId).symbol
            } (converted to ${txFee.feeInCpay.asString(assetInfo[coreAsset].decimalPlaces, Amount.ROUND_UP)} CPAY)`;
        }
    }
);
