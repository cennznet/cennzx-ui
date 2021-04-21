import React, {FC} from 'react';
import styled from 'styled-components';
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

const Top = styled.div`
    display: flex;
    flex-direction: row;
    margintop: 20px;
    justify-content: space-between;
    min-width: 224px;
`;

const Input = styled.div`
    display: flex;
    height: 48px;
    line-height: 48px;
    width: calc(100% - 2rem);
    background-color: #fff;
    border: 1px solid #b5babd;
    border-radius: 3px;
    font-size: 14px;
    :hover {
        border: 1px solid #1130ff;
        border-radius: 3px;
    }
    input {
        border: 0;
        flex: 1;
        padding: 0 1rem;
    }
`;

const Multiple = styled.div`
    display: inline-block;
    padding: 0 12px;
    border-left: 1px solid #b5babd;
`;

interface InputProps {
    value?: string | number;
    onChange: (event: any) => void;
    title: string;
    placeholder?: string;
    message?: string;
    multiple?: any;
    type?: string;
}

const InputBox: FC<InputProps> = ({value, onChange, title, placeholder, message, multiple, type = 'text'}) => {
    return (
        <Trade>
            <Top>
                <span>
                    <h2>{title}</h2>
                </span>
            </Top>
            <Input onChange={onChange}>
                <input type={type} value={value} placeholder={placeholder} />
                {multiple && <Multiple>{multiple}</Multiple>}
            </Input>
            {/* {message && <MessageBox>{message}</MessageBox>} */}
        </Trade>
    );
};

export default InputBox;
