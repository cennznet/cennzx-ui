import {hexToString} from '@polkadot/util';
import {createSelector} from 'reselect';
import {AppState} from '../../redux/reducers';
import {Asset, IAssetBalance, IExchangePool, IUserShareInPool} from '../../typings';
import {Amount} from '../../util/Amount';
import {getAsset as getAsset_} from '../../util/assets';
//import {DECIMALS} from './liquidity';

const getBuffer = (state: AppState) => state.ui.liquidity.form.buffer;
const getAsset = (state: AppState) => state.ui.liquidity.form.assetId;
const getSigningAccount = (state: AppState) => state.ui.liquidity.form.signingAccount;
const getAssetAmount = (state: AppState) => state.ui.liquidity.form.assetAmount;
const getCoreAmount = (state: AppState) => state.ui.liquidity.form.coreAmount;
const getExchangePool = (state: AppState) => state.ui.liquidity.exchangePool;
const getExchangeRate = (state: AppState) => state.ui.liquidity.exchangeRate;
const getTxFee = (state: AppState) => state.ui.liquidity.txFee;
const getFeeAssetId = (state: AppState) => state.ui.liquidity.form.feeAssetId;
const getCoreAsset = (state: AppState) => state.global.coreAssetId;
const getUserAssetBalance = (state: AppState) => state.ui.liquidity.userAssetBalance;
const getAllUserPoolShare = (state: AppState) => state.ui.liquidity.userPoolShare;
const getAssetInfo = (state: AppState) => state.global.assetInfo;

export const getAssets = createSelector(
    [getAssetInfo],
    assetInfo => {
        const newAssetList = [];
        assetInfo &&
            assetInfo.forEach(asset => {
                const assetObject = {
                    symbol: hexToString(asset.symbol),
                    id: asset.id,
                };
                newAssetList.push(assetObject);
            });
        return newAssetList;
    }
);

export const getUserPoolShare = createSelector(
    [getAsset, getAllUserPoolShare, getSigningAccount],
    (assetId, poolShare, signingAccount) => {
        if (!assetId) return null;
        if (!poolShare.length) return null;
        const accountAssetBalance = poolShare.find(
            (share: IUserShareInPool) => share.assetId === assetId && share.address === signingAccount
        );
        return accountAssetBalance;
    }
);

// always fixed to CPAY
export const getLiquidityExchangeRate = createSelector(
    [getAsset, getAssetAmount, getCoreAsset],
    (asset, add1Amount, getCoreAsset) => {}
);

export const getAccountAssetBalance = createSelector(
    [getAsset, getUserAssetBalance, getSigningAccount],
    (assetId, userBalance, signingAccount) => {
        if (!assetId) return null;
        if (!userBalance.length) return null;
        const accountAssetBalance = userBalance.find(
            (bal: IAssetBalance) => bal.assetId === assetId && bal.account === signingAccount
        );
        if (accountAssetBalance) {
            return accountAssetBalance.balance;
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
            return exchangePool[0].coreAssetBalance;
        }
    }
);

export const getCoreReserve = createSelector(
    [getAsset, getExchangePool],
    (asset, exchangePool) => {
        if (!asset) return null;
        if (!exchangePool.length) return null;
        const poolBalanceForBuyAsset = exchangePool.find((poolData: IExchangePool) => poolData.assetId === asset);
        if (poolBalanceForBuyAsset) {
            return poolBalanceForBuyAsset.coreAssetBalance;
        }
    }
);

const getOptionByValue = (options: Asset[], valueOfSelectedItem: number) =>
    options ? options.find(item => item.id === valueOfSelectedItem) || null : null;

export const getExchangeRateMsg = createSelector(
    [getExchangeRate, getAssets, getCoreAsset, getAsset, getCoreAmount, getAssetInfo],
    (exchangeRate, assets, coreAsset, asset, coreAmount, assetInfo) => {
        if (!coreAmount || !exchangeRate) return;
        let rate = +exchangeRate.asString(assetInfo[coreAsset].decimalPlaces) / +coreAmount.asString();
        rate = Math.round(rate * 10000) / 10000;
        return exchangeRate
            ? `Exchange rate: 1 ${getOptionByValue(assets, coreAsset).symbol} = ${rate} ${
                  getOptionByValue(assets, asset).symbol
              }.`
            : '';
    }
);
export const getFee = createSelector(
    [getTxFee, getCoreAsset, getFeeAssetId, getAssetInfo],
    (txFee, coreAsset, feeAssetId, assetInfo) => {
        let fee;
        const assetSymbol = getAsset_(feeAssetId).symbol;
        if (coreAsset && coreAsset === feeAssetId && txFee) {
            fee = `${txFee.feeInCpay.asString(assetInfo[feeAssetId].decimalPlaces)} ${assetSymbol}`;
        } else if (txFee && txFee.feeInFeeAsset) {
            fee = `${txFee.feeInFeeAsset.asString(assetInfo[feeAssetId].decimalPlaces)} CPAY)`;
        }
        return fee;
    }
);

export const getTxFeeMessage = createSelector(
    [getTxFee, getAssets, getFeeAssetId, getCoreAsset, getAssetInfo],
    (txFee, assets, feeAssetId, coreAsset, assetInfo) => {
        let fee;
        if (String(feeAssetId) === String(coreAsset) && txFee) {
            // If fee asset is CPAY use cpayFee
            fee = txFee.feeInCpay.asString(assetInfo[coreAsset].decimalPlaces, Amount.ROUND_UP);
            return `Transaction fee is ${fee} ${getOptionByValue(assets, feeAssetId).symbol}`;
        } else if (txFee && txFee.feeInFeeAsset) {
            fee = txFee.feeInFeeAsset.asString(assetInfo[feeAssetId].decimalPlaces, Amount.ROUND_UP);
            return `Transaction fee is ${fee} ${
                getOptionByValue(assets, feeAssetId).symbol
            } (converted to ${txFee.feeInCpay.asString(assetInfo[coreAsset].decimalPlaces, Amount.ROUND_UP)} CPAY)`;
        }
    }
);
