import {IOption} from '../typings';

export const getOptionByValue = (options: IOption[], valueOfSelectedItem: number | string) =>
    options ? options.find(item => item.value === valueOfSelectedItem) || null : null;

// respect window.config.ASSETS rather than assetRegistry, so we can use test assets(not only reserve assets)
// export const getAssetSymbol = assetId => assetRegistry.findAssetById(assetId).symbol;
