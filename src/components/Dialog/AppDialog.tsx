import {version as extVersion} from '@polkadot/extension-dapp/package-info.json';
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

const getDialogBody = (detected: boolean, connected: boolean, metadata) => {
    if (!detected) {
        return (
            <div>
                CENNZX requires the CENNZnet browser extension to manage transaction signing.
                <br />
            </div>
        );
    } else if (!connected) {
        // Polkadot is not allowed to access this site - show relevant message
        return 'CENNZX is disallowed in your CENNZnet extension settings. Go to \'Manage website access\' and allow this site to continue.';
    } else if (!metadata) {
        // Update metadata, wait until it gets loaded
        return 'Please wait.. getting the latest metadata file for the best experience with CENNZX & CENNZnet extension.';
    } else {
        // Update metadata
        return 'Install the latest metadata file for the best experience with CENNZX & CENNZnet extension.';
    }
};

const getDialogFooter = (
    setDialogOpen: Function,
    extensionConnected: boolean,
    polkadotExtension: InjectedExtension,
    metadataDef
) => {
    return (
        <Container>
            {extensionConnected === false || metadataDef === undefined ? null : (
                <BlueButton
                    onClick={async () => {
                        const metadata = polkadotExtension.metadata;
                        await metadata.provide(metadataDef);
                        const chain = typeof window !== 'undefined' ? window.config.CHAIN : 'Development';
                        localStorage.setItem(`${extVersion}-${chain}-EXTENSION_META_UPDATED`, 'true');
                        setDialogOpen(false);
                    }}
                >
                    Update Metadata
                </BlueButton>
            )}
            <BlueButton
                onClick={async () => {
                    setDialogOpen(false);
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
    const [isDialogOpen, setDialogOpen] = useState(true);

    return (
        <Dialog
            {...props}
            isOpen={isDialogOpen}
            title={'Connect to CENNZnet extension'}
            body={getDialogBody(extensionDetected, extensionConnected, metadata)}
            footer={getDialogFooter(setDialogOpen, extensionConnected, polkadotExtension, metadata)}
        />
    );
};

export default AppDialog;
