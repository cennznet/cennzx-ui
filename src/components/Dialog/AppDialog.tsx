import {InjectedExtension, MetadataDef} from '@polkadot/extension-inject/types';
import {Link} from '@reach/router';
import React, {FC, useState} from 'react';
import styled from 'styled-components';
import Dialog, {DialogProps} from './Dialog';
import {BlueButton} from './DialogButtons';

const Container = styled.div`
    display: flex;
    width: 40%;
    justify-content: space-around;
`;

const getDialogBody = (detected: boolean, connected: boolean) => {
    if (!detected) {
        return (
            // <React.Fragment>
            <div>
                To use CENNZX you need to install and connect to the Polkadot browser extension. If you don't have the
                extension installed you can download it
                {/*for some reason not able to remove the following link*/}
                <Link to="https://soramitsu.co.jp/validator-plugin"> here</Link>
                <a href={'https://soramitsu.co.jp/validator-plugin'}>yum</a>
            </div>
        );
    } else if (!connected) {
        // Polkadot is not allowed to access this site - show relevant message
        return 'To use CENNZX you need to go to Polkadot extension settings, Manage website access and allow this site to use extension.';
    } else {
        // Update metadata
        return 'To use CENNZX you need to update metadata for the Polkadot browser extension.';
    }
};

const getDialogFooter = (
    setState: Function,
    extensionConnected: boolean,
    polkadotExtension: InjectedExtension,
    metadataDef
) => {
    return (
        <Container>
            {extensionConnected === false ? null : (
                <BlueButton
                    onClick={async () => {
                        const metadata = polkadotExtension.metadata;
                        await metadata.provide(metadataDef);
                        localStorage.setItem('EXTENSION_META_UPDATED', 'true');
                        setState({isOpen: false});
                    }}
                >
                    Update Metadata
                </BlueButton>
            )}
            <BlueButton
                onClick={async () => {
                    setState({isOpen: false});
                }}
            >
                Cancel
            </BlueButton>
        </Container>
    );
};

// extend the props excluding handled ones and including extra ones
export type AppDialogProps = Pick<DialogProps, Exclude<keyof DialogProps, 'title' | 'body' | 'footer' | 'isOpen'>> & {
    extensionConnected: boolean;
    extensionDetected: boolean;
    polkadotExtension: InjectedExtension;
    metadata: MetadataDef;
};

const AppDialog: FC<AppDialogProps> = props => {
    const {extensionDetected, extensionConnected, polkadotExtension, metadata} = props;
    const [state, setState] = useState({isOpen: true});
    const {isOpen} = state;

    return (
        <Dialog
            {...props}
            isOpen={isOpen}
            title={'Connect to Polkadot extension'}
            body={getDialogBody(extensionDetected, extensionConnected)}
            footer={getDialogFooter(setState, extensionConnected, polkadotExtension, metadata)}
        />
    );
};

export default AppDialog;
