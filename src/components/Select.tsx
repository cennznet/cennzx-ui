import {Select as SelectCom} from 'centrality-react-core';
import {SelectProps} from 'centrality-react-core/components/Select';
import React, {FC} from 'react';
import styled from 'styled-components';

type AssetDropDownStyledProps = SelectProps<any> & {
    showBorder: boolean;
    showInterval: boolean;
};

interface SelectOption {
    label: string;
    value: string;
}

interface AssetInputProps {
    value?: string;
    options: Array<SelectOption>;
    onChange: (newVal: string) => void;
}

const Trade = styled.div`
    margin-top: 20px;
    flex-direction: row;

    h2 {
        font-size: 16px;
        font-weight: 600;
        color: #4e5458;
    }
`;

const StyledSelect = styled(SelectCom)<AssetDropDownStyledProps>`
    flex: 1;
    min-width: 112px;
    > div {
        border-width: ${props => (props.showBorder.toString() === 'true' ? '1px' : '0px')};
    }

    // remove border from right of select 
    .react-select__indicators > span {
        background: ${props => (props.showBorder.toString() === 'true' ? '#b5babd' : 'none')}; !important;
    }

    // add border to left of select 
    .react-select__value-container {
        border-left: ${props => (props.showInterval.toString() === 'true' ? '1px solid #b5babd;' : 'none')}; !important;
        min-height: 28px;
    }

    // drop down indicator hover color
    .react-select__dropdown-indicator > svg:hover {
        color: #1130ff !important;
    }

    // remove padding from select option, this padding is added back to the container
    .react-select__option {
        padding: 0px;
        background-color: white;
    }

    .react-select__option--is-selected:hover,
    .react-select__option--is-focused:hover {
        // background hover/active color
        background-color: #1130ff;

        // color of text on hover/active
        span {
            color: #ffffff !important;
        }
    }

    // remove padding around the entire menu
    .react-select__menu-list {
        padding-top: 0px;
        padding-bottom: 0px;
    }
`;
const Top = styled.div`
    display: flex;
    flex-direction: row;
    margintop: 20px;
    justify-content: space-between;
    min-width: 224px;
`;

const Container = styled.div`
    color: #333;
    font-weight: bolder;
    padding: 8px 0px;
    align-items: center;
    display: flex;
    :hover {
        color: #1130ff;
    }
    border: none !important;
    border-bottom: 1px solid #b5babd !important;
`;

const Text = styled.span`
    font-size: 14px;
    padding: 0 12px;
`;

const getLabel = ({label}) => (
    <Container>
        <Text>{label}</Text>
    </Container>
);

const getOptionByValue = (options: Array<SelectOption>, value: string) =>
    options ? options.find(item => item.value === value) || null : null;

const Select: FC<AssetInputProps> = ({value, options, onChange}) => {
    return (
        <Trade>
            <StyledSelect
                value={getOptionByValue(options, value as string)}
                getOptionLabel={getLabel}
                options={options}
                showBorder={true}
                showInterval={false}
                onChange={e => onChange(e.value)}
            />
        </Trade>
    );
};

export default Select;
