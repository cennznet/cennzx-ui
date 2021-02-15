import React, {FC, useState} from 'react';
import Dialog, {DialogProps} from './Dialog';
import {BlueButton} from './DialogButtons';
import TextInput from 'components/TextInput';
import styled from 'styled-components';
import {Button} from 'centrality-react-core';
import {cryptoWaitReady, mnemonicGenerate} from '@polkadot/util-crypto';
import keyring from '@polkadot/ui-keyring';
import FileSaver from 'file-saver';

const getDialogTitle = () => {
    return 'Create an account';
};

const getDialogBody = _toggleCreate => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    return (
        <React.Fragment>
            <TextInput
                title={'Name'}
                placeholder={'Enter name'}
                value={name}
                onChange={e => {
                    setName(e.target.value);
                }}
            />
            <Top>
                <span>
                    <h4>{'Password'}</h4>
                </span>
            </Top>
            <Input>
                <input
                    type={'password'}
                    onChange={element => {
                        setPassword(element.currentTarget.value);
                    }}
                />
            </Input>
            <Button
                style={{marginTop: '25px'}}
                disabled={name === '' || password === ''}
                onClick={() => {
                    cryptoWaitReady().then(() => {
                        const seed = mnemonicGenerate();
                        const result = keyring.addUri(seed, password, {name: name});
                        const {json, pair} = result;
                        const blob = new Blob([JSON.stringify(json)], {type: 'application/json; charset=utf-8'});
                        FileSaver.saveAs(blob, `${pair.address}.json`);
                        _toggleCreate();
                    });
                }}
            >
                Create account
            </Button>
        </React.Fragment>
    );
};

const getDialogFooter = _toggleCreate => (
    <>
        <BlueButton onClick={() => _toggleCreate()}>Close</BlueButton>
    </>
);

// extend the props excluding handled ones and including extra ones
export type CreateDialogProps = Pick<
    DialogProps,
    Exclude<keyof DialogProps, 'title' | 'body' | 'footer' | 'isOpen'>
> & {
    accountCreation: boolean;
    _toggleCreate: Function;
};

const CreateAccountDialog: FC<CreateDialogProps> = props => {
    const {accountCreation, _toggleCreate} = props;
    const isCreateOpen = accountCreation;

    return (
        <Dialog
            {...props}
            isOpen={isCreateOpen}
            title={getDialogTitle()}
            body={getDialogBody(_toggleCreate)}
            footer={getDialogFooter(_toggleCreate)}
        />
    );
};

export default CreateAccountDialog;

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
