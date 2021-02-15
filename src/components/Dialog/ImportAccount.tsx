import React, {FC, useState} from 'react';
import Dialog, {DialogProps} from './Dialog';
import {BlueButton} from './DialogButtons';
import styled from 'styled-components';
import {Button} from 'centrality-react-core';
import keyring from '@polkadot/ui-keyring';
import {isObject} from '@polkadot/util';

const getDialogTitle = () => {
    return 'Import account';
};

const getDialogBody = _toggleImport => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [password, setPassword] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [isValid, setIsValid] = useState(false);

    return (
        <React.Fragment>
            <div>
                <Top>
                    <span>
                        <h4>
                            Select the JSON key file that was downloaded when you created the account. This JSON file
                            contains your private key encrypted with your password.
                        </h4>
                    </span>
                </Top>

                <div>
                    <InputFileLabel htmlFor="filePicker">Upload backup file</InputFileLabel>
                    <input
                        id="filePicker"
                        style={{visibility: 'hidden'}}
                        type={'file'}
                        onChange={element => {
                            const fileReader = new FileReader();
                            fileReader.readAsText(element.target.files[0], 'UTF-8');
                            fileReader.onload = e => {
                                const json = JSON.parse(e.target.result);
                                const publicKey = keyring.decodeAddress(json.address, true);
                                const isFileValid =
                                    publicKey.length === 32 &&
                                    json.encoded &&
                                    isObject(json.meta) &&
                                    (Array.isArray(json.encoding.content)
                                        ? json.encoding.content[0] === 'pkcs8'
                                        : json.encoding.content === 'pkcs8');
                                setIsValid(isFileValid);
                                setSelectedFile(json);
                            };
                        }}
                    />
                    <span>
                        <h4>{'Password'}</h4>
                    </span>
                    <input
                        type={'password'}
                        onChange={element => {
                            const pass = element.currentTarget.value;
                            setErrorMessage('');
                            setPassword(pass);
                        }}
                    />
                    {errorMessage && <ErrorInput type={'text'} disabled={'true'} value={errorMessage} />}
                    <Button
                        style={{marginTop: '25px'}}
                        disabled={!isValid}
                        onClick={() => {
                            try {
                                const pair = keyring.restoreAccount(selectedFile, password);
                                const {address} = pair;
                                // @ts-ignore
                                console.log('Restored address:', address);
                                _toggleImport();
                            } catch (e) {
                                console.log(e);
                                setErrorMessage(e.message);
                            }
                        }}
                    >
                        Import account
                    </Button>
                </div>
            </div>
        </React.Fragment>
    );
};

const getDialogFooter = _toggleImport => (
    <>
        <BlueButton onClick={() => _toggleImport()}>Close</BlueButton>
    </>
);

// extend the props excluding handled ones and including extra ones
export type ImportDialogProps = Pick<
    DialogProps,
    Exclude<keyof DialogProps, 'title' | 'body' | 'footer' | 'isOpen'>
> & {
    accountImport: boolean;
    _toggleImport: Function;
};

const ImportAccountDialog: FC<ImportDialogProps> = props => {
    const {accountImport, _toggleImport} = props;

    return (
        <Dialog
            {...props}
            isOpen={accountImport}
            title={getDialogTitle()}
            body={getDialogBody(_toggleImport)}
            footer={getDialogFooter(_toggleImport)}
        />
    );
};

export default ImportAccountDialog;

const InputFileLabel = styled.label`
    background: #00aec9;
    padding: 5px 150px;
    color: #fff;
    cursor: pointer;
    margin-bottom: 0;
    width: 100%;
    border-radius: 5px;
    height: 35px;
    border-color: transparent;
    box-shadow: 0px;
    outline: none;
    transition: 0.15s;
    text-align: center;
    &:active {
        background-color: #f1ac15;
    }
`;

const Top = styled.div`
    display: flex;
    flex-direction: row;
    margintop: 20px;
    justify-content: space-between;
    min-width: 224px;
`;

const ErrorInput = styled.input`
    width: 50%;
    border: none;
    font-size: 14px;
    color: red;
    margin-left: 5px;
`;
