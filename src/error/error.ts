import {FormSection} from '../pages/exchange/exchange';
import {FormSection as FormSectionForLiquidity} from '../pages/liquidity/liquidity';
import {Asset} from '../typings';
import {Amount} from '../util/Amount';

export abstract class BaseError extends Error {
    abstract name: string;
    origin: Error;
    __proto__: any;

    protected constructor(msg: string, throwable?: Error) {
        super(msg);
        this.origin = throwable;

        const actualProto = new.target.prototype;

        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(this, actualProto);
        } else {
            this.__proto__ = actualProto;
        }
    }
}

export class InsufficientBalanceForOperation extends BaseError {
    name: string = 'InsufficientBalanceForOperation';
    constructor(remain: Amount, need: Amount, feeAsset: string) {
        super(`Needed: ${need.asString(5, Amount.ROUND_UP)} and user has only ${remain.asString(5)} ${feeAsset}`);
    }
}

export class InsufficientFeeForOperation extends BaseError {
    name: string = 'InsufficientFeeForOperation';
    constructor(msg) {
        super(msg);
    }
}

export class ExtrinsicFailed extends BaseError {
    name: string = 'ExtrinsicFailed';
    constructor(msg) {
        super(msg);
    }
}

export class NodeConnectionTimeOut extends BaseError {
    name: string = 'NodeConnectionTimeOut';
    constructor() {
        super('Connection from node failed');
    }
}

export class EmptyPool extends BaseError {
    name: string = 'EmptyPool';
    asset: Asset;
    constructor(asset: Asset) {
        super(`The pool for asset: ${asset.symbol} is empty.`);
        this.asset = asset;
    }
}

export type FormErrorTypes =
    | AmountExceedsPoolBalance
    | EmptyPool
    | PoolBalanceNotEnough
    | UserBalanceNotEnough
    | UserBalanceNotEnoughForFee
    | FromAssetAmountRequired
    | ToAssetAmountRequired
    | FromAssetNotSelected
    | ToAssetNotSelected
    | AccountNotSelected
    | FieldNotReady
    | RecipientAddress
    | UnknownFormError;

export class AmountExceedsPoolBalance extends BaseError {
    name: string = 'AmountExceedsPoolBalance';
    constructor() {
        super('The price exceeds the pool capacity');
    }
}

export class PoolBalanceNotEnough extends BaseError {
    name: string = 'PoolBalanceNotEnough';
    asset: Asset;
    constructor(asset: Asset, require: Amount, reserve: Amount) {
        super(
            `Not enough in the pool of ${asset.symbol}, require: ${require.asString(5)}, reserve: ${reserve.asString(
                5
            )}`
        );
        this.asset = asset;
    }
}

export class UserBalanceNotEnough extends BaseError {
    name: string = 'UserBalanceNotEnough';
    asset: Asset;
    constructor(asset: Asset, require?: Amount) {
        super(
            require
                ? `Not enough available, requires ${require.asString(asset.decimalPlaces, Amount.ROUND_UP)} ${
                      asset.symbol
                  }`
                : `Not enough available`
        );
        this.asset = asset;
    }
}

export class UserBalanceNotEnoughForFee extends BaseError {
    name: string = 'UserBalanceNotEnoughForFee';
    feeAsset: Asset;
    constructor(feeAsset: Asset, require: Amount, reserve: Amount) {
        super(
            // TODO : need to check with designer on the message.
            `Not enough ${feeAsset.symbol} in wallet to pay transaction fee, requires additional: ${require &&
                require.asString(feeAsset.decimalPlaces, Amount.ROUND_UP)}`
        );
        this.feeAsset = feeAsset;
    }
}

export class UserPoolBalanceNotEnough extends BaseError {
    name: string = 'UserPoolBalanceNotEnough';
    asset: Asset;
    constructor(asset: Asset, require?: Amount, reserve?: Amount) {
        super(
            require
                ? `Not enough ${asset.symbol} in user pool, require: ${require.asString(
                      asset.decimalPlaces,
                      Amount.ROUND_UP
                  )}, available: ${reserve.asString(asset.decimalPlaces)}`
                : `Not enough ${asset.symbol} in user pool`
        );
        this.asset = asset;
    }
}

export class FromAssetAmountRequired extends BaseError {
    name: string = 'FromAssetAmountRequired';
    constructor(symbol: string) {
        super(`Please enter ${symbol}`);
    }
}

export class RecipientAddress extends BaseError {
    name: string = 'RecipientAddress';
    constructor() {
        super('Please enter an address');
    }
}

export class ToAssetAmountRequired extends BaseError {
    name: string = 'ToAssetAmountRequired';
    constructor(symbol: string) {
        super(`Please enter ${symbol}`);
    }
}

export class FromAssetNotSelected extends BaseError {
    name: string = 'FromAssetNotSelected';
    constructor() {
        super('Please select an asset');
    }
}

export class ToAssetNotSelected extends BaseError {
    name: string = 'ToAssetNotSelected';
    constructor() {
        super('Please select an asset');
    }
}

export class AccountNotSelected extends BaseError {
    name: string = 'AccountNotSelected';
    constructor() {
        super('Please select an account');
    }
}

export class FieldNotReady extends BaseError {
    name: string = 'FieldNotReady';
    field: FormSection;
    constructor(field: FormSection) {
        super('Please wait');
        this.field = field;
    }
}

export class FieldNotReadyForLiquidity extends BaseError {
    name: string = 'FieldNotReady';
    field: FormSectionForLiquidity;
    constructor(field: FormSectionForLiquidity) {
        super('Please wait');
        this.field = field;
    }
}

export class UnknownFormError extends BaseError {
    name: string = 'UnknownFormError';
    error: Error;
    constructor(error: Error) {
        super(error.message);
        this.error = error;
    }
}
