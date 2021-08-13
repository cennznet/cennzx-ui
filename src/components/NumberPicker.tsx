import React, {FC, ReactNode} from 'react';
import styled from 'styled-components';
import {BlueButton} from './Dialog/DialogButtons';
import NumberBox from './NumberBox';

const Container = styled.div`
    display: flex;
    flex-direction: row;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 12px;
    width: 157px;
`;

export interface BlueButtonSwitchProps {
    checked: boolean;
}

const BlueButtonSwitch = styled(BlueButton as any)<BlueButtonSwitchProps>`
    border-width: 1px;
    border-color: ${props => (props.checked.toString() === 'true' ? '#B5BABD;' : '#B5BABD;')};
    background-color: ${props => (props.checked.toString() === 'true' ? '#1130ff' : 'white')};
    color: ${props => (props.checked.toString() === 'true' ? '#FFFFFF' : '#4E5458;')};
    border-radius: 3px;

    :hover {
        border: 1px solid #1130ff;
        background-color: ${props => (props.checked.toString() === 'true' ? '#1130ff' : 'white')};
        color: ${props => (props.checked.toString() === 'true' ? 'white' : '#1130ff')};
    }
    height: 48px;
    min-width: 157px;
`;

interface NumberPickerProps {
    onChange: (value: number) => void;
    value: number;
    max?: number;
    min?: number;
    options?: {display: string; value: number}[];
    step?: number;
    suffix?: string;
    // label?: ReactNode;
    // defaultLabel?: ReactNode;
}
const NumberPicker: FC<NumberPickerProps> = ({onChange, value, max, min, step, options, suffix}) => {
    //@ts-ignore
    const optionsColumns = options.map(option => (
        <Column>
            {option.display && (
                <BlueButtonSwitch onClick={() => onChange(option.value)} checked={option.value === value}>
                    {option.display}
                </BlueButtonSwitch>
            )}
        </Column>
    ));
    return (
        <Container>
            {optionsColumns}
            <Column>
                <NumberBox
                    step={step as number}
                    max={max as number}
                    min={min as number}
                    value={value}
                    suffix={suffix}
                    onChange={onChange}
                />
            </Column>
        </Container>
    );
};

export default NumberPicker;
