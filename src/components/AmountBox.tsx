import {Input} from 'centrality-react-core';
import {InputProps} from 'centrality-react-core/components/Input';
import React from 'react';
import styled from 'styled-components';
import {Amount, AmountUnit} from '../util/Amount';

// extend the props excluding handled ones and including extra ones
export type StyledInputProps = InputProps & {
    onChange: (value: React.ChangeEvent) => void;
};

const StyledInput = styled(Input)<StyledInputProps>`
    background-color: ${props => (props.readOnly ? '#EBECED' : 'white')};
    color: black;
    height: 100%;
    border: none;
    caret-color: #1130ff;
    margin-top: auto;
    margin-bottom: auto;
    min-width: 0px !important;

    :hover {
        border: none;
    }

    :focus {
        border: none;
    }
`;

const StyledInputParent = styled.div`
    min-width: 0px !important;
    flex: 1 0 60%;

    div {
        margin-top: 0px;
        height: 100%;
    }
`;

const MAX_DECIMALS = 18;

interface AmountBoxProps {
    value: Amount;
    onChange: Function;
    readOnly: boolean;
}

interface AmountBoxState {
    displayValue: string;
}

class AmountBox extends React.Component<AmountBoxProps, AmountBoxState> {
    constructor(props: AmountBoxProps) {
        super(props);

        // set the display value as soon as this component is built
        this.state = {
            displayValue: props.value ? props.value.asString() : '',
        };
    }

    removeTrailingZero = (valueIn: string, removeDecimal: boolean) => {
        let value = valueIn;

        if (value.indexOf('.') === -1) {
            return value;
        }
        while (value.charAt(value.length - 1) === '0') {
            value = value.substring(0, value.length - 1);
            // remove all zeros
        }
        if (removeDecimal) {
            // remove dot at end if there is one
            if (value.charAt(value.length - 1) === '.') {
                value = value.substring(0, value.length - 1);
            }
        }

        return value;
    };

    componentWillReceiveProps = nextProps => {
        if (!nextProps.value) {
            this.setState({displayValue: ''});
        } else if (
            !new Amount(this.removeTrailingZero(this.state.displayValue, true), AmountUnit.DISPLAY).eq(nextProps.value)
        ) {
            this.setState({displayValue: nextProps.value.asString()});
        }
    };

    render = () => (
        <StyledInputParent>
            <StyledInput
                valid
                readOnly={this.props.readOnly}
                value={this.state.displayValue}
                onChange={e => this.maybeSetValue((e.target as HTMLInputElement).value, this.props.value)}
            />
        </StyledInputParent>
    );

    updateAmount = (value: string): Amount => {
        return this.props.onChange(value !== '' ? new Amount(value.toString(), AmountUnit.DISPLAY) : null);
    };

    // wherever return is below it means , totally ignore the change, as in those situations the character is invalid
    // and the display value and the amount value should not be updated
    maybeSetValue = (valueIn: any, oldAmount: Amount) => {
        let value = valueIn;

        // disallow spaces
        if (value.indexOf(' ') !== -1) {
            return;
        }

        // make . become 0. as this is a number and . is not
        if (value === '.') {
            value = '0.';
        }

        const firstDot = value.indexOf('.');
        const lastDot = value.lastIndexOf('.');
        // dont allow more then one  dot
        if (lastDot !== -1 && firstDot !== lastDot) {
            return;
        }

        if (value.toUpperCase() === 'E') {
            return;
        }

        // only allow numbers
        if (isNaN(value)) {
            return;
        }

        // only allow a certain number of decimal places
        if (firstDot !== -1) {
            const decimalPlaces = value.substring(firstDot + 1).length;
            if (decimalPlaces > MAX_DECIMALS) {
                return;
            }
        }

        // if the code gets here it means the value is valid
        const newAmount = this.removeTrailingZero(value, true);
        if (oldAmount && oldAmount.eq(new Amount(newAmount, AmountUnit.DISPLAY))) {
            this.setState({displayValue: value}); // no change only uopdate display value ( don't inform parent)
        } else {
            /*
            The value has changed, update the display value and then inform parent right after in the callback.
            allow the user's display value to be put into the text input, and then update the amount; that will
            update the outside in this case AssetInput > exchange page > That will update the Amount in it's self,
            then this control's component will receive props method will be called,
            and will only update the display value in this if the amount has changed
            */

            this.setState({displayValue: value}, () => this.updateAmount(newAmount));
        }
    };
}

export default AmountBox;
