import {Input} from 'centrality-react-core';
import {InputProps} from 'centrality-react-core/components/input';
import React from 'react';
import styled from 'styled-components';

// extend the props excluding handled ones and including extra ones
export type StyledInputProps = Pick<InputProps, Exclude<keyof InputProps, 'value' | 'onChange'>> & {
    onChange: Function;
    step: number;
    max: number;
    min: number;
};

const StyledInput = styled(Input)<StyledInputProps>`
    background-color: ${props => (props.readOnly ? '#EBECED' : 'white')};
    color: black;
    height: 48px;
    caret-color: #1130ff;
    border-color: #b5babd;
    border-radius: 3px;
    border: 0.8px solid #b5babd;
    height: 48px;
    width: 100%;

    :hover {
        border-color: #1130ff;
    }

    :focus {
        border-color: #1130ff;
    }
`;

const StyledInputParent = styled.div`
    div {
        margin-top: 0px;
        height: 100%;
    }
`;

const MAX_DECIMALS = 10;

interface NumberBoxProps {
    value: number;
    onChange: (value: number) => void;
    step: number;
    max: number;
    min: number;
    suffix?: string;
}

class NumberBox extends React.Component<NumberBoxProps> {
    constructor(props: NumberBoxProps) {
        super(props);
    }

    render = () => (
        <StyledInputParent>
            <StyledInput
                step={this.props.step}
                min={this.props.min}
                max={this.props.max}
                type={'number'}
                suffix={this.props.suffix ? this.props.suffix : null}
                value={this.props.value}
                onChange={e => this.maybeSetValue((e.target as HTMLInputElement).value)}
            />
        </StyledInputParent>
    );

    maybeSetValue = (valueIn: string) => {
        let value = valueIn;

        if (((value as unknown) as number) > this.props.max) {
            value = this.props.max.toString();
        } else if (((value as unknown) as number) < this.props.min) {
            value = this.props.min.toString();
        }

        const firstDot = value.indexOf('.');

        // only allow a certain number of decimal places
        if (firstDot !== -1) {
            const decimalPlaces = value.substring(firstDot + 1).length;
            if (decimalPlaces > MAX_DECIMALS) {
                return;
            }
            this.props.onChange(parseFloat(value));
        } else {
            this.props.onChange(parseInt(value));
        }
    };
}

export default NumberBox;
