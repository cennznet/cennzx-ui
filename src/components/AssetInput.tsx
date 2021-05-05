import TransparentButton from 'components/TransparentButton';
import React, {FC} from 'react';
import styled from 'styled-components';
import {AmountParams, Asset} from '../typings';
import {Amount} from '../util/Amount';
import AmountBox from './AmountBox';
import AssetDropDown from './AssetDropDown';
import FlexDiv from './FlexDiv';
import MessageBox from './MessageBox';

const Trade = styled.div`
    margin-top: 20px;
    flex-direction: row;

    h2 {
        font-size: 16px;
        font-weight: 600;
        color: #4e5458;
    }
`;

const InputAndSelect = styled(FlexDiv)`
    height: 48px;
    background-color: transparent;
    border: 1px solid #b5babd;
    border-radius: 3px;

    :hover {
        border: 1px solid #1130ff;
        border-radius: 3px;
    }

    font-size: 14px;
`;
interface AssetInputProps {
    value: AmountParams;
    options: Asset[];
    onChange: (newVal: AmountParams) => void;
    title: string;
    message: string;
    max?: Amount;
    secondaryTitle?: string;
    disableAmount?: boolean;
}

const Top = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-width: 420px;
`;

const getAmountParams = (amount: Amount, assetId: number, amountChange: boolean): AmountParams => ({
    amount,
    assetId,
    amountChange,
});

const AssetInput: FC<AssetInputProps> = ({
    max,
    value,
    options,
    onChange,
    title,
    message,
    secondaryTitle,
    disableAmount,
}) => {
    const {assetId, amount} = value;
    return (
        <Trade>
            <Top>
                <span>
                    <h2>
                        {title} {secondaryTitle && secondaryTitle}
                    </h2>
                </span>
                {max && (
                    <TransparentButton onClick={() => onChange(getAmountParams(max, assetId, true))}>
                        Max
                    </TransparentButton>
                )}
            </Top>
            <InputAndSelect id="trade">
                <AmountBox
                    readOnly={disableAmount}
                    value={amount}
                    onChange={value => {
                        onChange(getAmountParams(value, assetId, true));
                    }}
                />
                <AssetDropDown
                    isSearchable={false}
                    value={assetId}
                    options={options}
                    onChange={(asset: Asset) => onChange(getAmountParams(amount, asset.id, false))}
                    showBorder={false}
                />
            </InputAndSelect>
            <MessageBox>{message}</MessageBox>
        </Trade>
    );
};

export default AssetInput;
