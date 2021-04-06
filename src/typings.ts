import {ApiRx} from '@cennznet/api';
import {Signer} from '@cennznet/api/types';
import {Observable} from 'rxjs/internal/Observable';
import {Amount} from './util/Amount';

export interface FeeExchangeResult {
    amount: Amount;
    assetId: number;
}

export interface IAccounts {
    name: string;
    assets?: Asset[];
    address: string;
}

export interface IAssetSwap {
    fromAsset: number;
    toAsset: number;
    fromAssetAmount: Amount;
    toAssetAmount: Amount;
}

export interface IAppConfig {
    ENDPOINT: string;
    ENV: string;
    ASSETS: Asset[];
    FEE_BUFFER: number;
    MAX_FEE_BUFFER: number;
    MIN_FEE_BUFFER: number;
}

export interface Asset {
    symbol: string;
    id: number;
    decimalPlaces?: number;
}

export interface AmountParams {
    amount: Amount;
    assetId: number;
    amountChange?: boolean;
}

export interface IOption {
    label: string;
    value: number | string;
}

declare global {
    interface Window {
        config: IAppConfig;
        cennznetInjected: CennznetInjectedGlobal;
        __REDUX_DEVTOOLS_EXTENSION__?: any;
    }
}

export interface IEpicDependency {
    api$: Observable<ApiRx>;
}

export interface IExtrinsic {
    method: string;
    params: any[];
    price: Amount;
}

// export interface AssetOutputExtrinsic extends IExtrinsic {
//     method: 'AssetOutput';
//     params: {};
// }

export interface IExchangePool {
    coreAssetBalance: Amount;
    assetBalance: Amount;
    address: string;
    assetId: number;
}

export interface IUserShareInPool {
    coreAssetBalance: Amount;
    assetBalance: Amount;
    liquidity: Amount;
    address: string;
    assetId: number;
}
export interface IAssetBalance {
    assetId: number;
    account: string;
    balance: Amount;
}

export interface IFee {
    feeInCpay: Amount;
    feeInFeeAsset: Amount;
}
export interface PolkadotInjectedGlobal {
    enable: any;
    // [name: string]: {
    //     version: string;
    //     enable(): Promise<CennznetInjected>;
    // };
    accounts: any;
    metadata?: {};
    name: string;
    provider?: any;
    signer: {};
    version: string;
}

export interface CennznetInjected {
    signer: Signer;
    accounts$: Observable<IAccounts[]>;
    accounts: IAccounts[];
}

export interface SingleSourceInjected extends CennznetInjected {
    isPaired$: Observable<boolean>;
    isPaired: boolean;
    pairedDevice$: Observable<{
        version: string;
        id: string;
    }>;
    pairedDevice;
}

export interface AddLiquidityFormData {
    assetId: number;
    coreAssetId: number;
    assetAmount: Amount;
    coreAmount: Amount;
    feeAssetId: number;
    investor: string;
    buffer: number;
}

export interface IUserBalance {
    assetBalance: Amount;
    coreBalance: Amount;
    investor: string;
}

export interface IAddLiquidity {
    form: Partial<AddLiquidityFormData>;
    investorBalance: IUserBalance;
}

export interface RemoveLiquidityFormData {
    asset: number;
    liquidity: Amount;
    feeAssetId: number;
    investor: string;
    buffer: number;
}

export interface IRemoveLiquidity {
    form: Partial<RemoveLiquidityFormData>;
    estimatedAssetToWithdraw: {
        core: Amount;
        asset: Amount;
    };
}

export interface ITxFeeParams {
    extrinsicParams: any[];
    feeAsset: number;
    investor: string;
}

export interface ExchangeFormData {
    fromAsset: number;
    toAsset: number;
    fromAssetAmount: Amount;
    toAssetAmount: Amount;
    signingAccount: string;
    extrinsic: string; //'buyAsset' | 'sellAsset'
    feeAssetId: number;
    buffer: number;
}

export interface SendFormData {
    fromAsset: number;
    toAsset: number;
    fromAssetAmount: Amount;
    toAssetAmount: Amount;
    signingAccount: string;
    recipientAddress: string;
    extrinsic: string; //'buyAsset' | 'sellAsset'
    feeAssetId: number;
    buffer: number;
}

export interface LiquidityFormData {
    assetId: number;
    assetAmount: Amount;
    coreAssetId: number;
    coreAmount: Amount;
    signingAccount: string;
    extrinsic: string;
    feeAssetId: number;
    buffer: number;
    type: string;
}
