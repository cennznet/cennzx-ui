import {Link} from '@reach/router';
import React, {FC, useState} from 'react';
import Dialog, {DialogProps} from './Dialog';
import {BlueButton} from './DialogButtons';

const getDialogTitle = (detected: boolean, connected: boolean) => {
    if (!detected) {
        return 'Connect to Polkadot extension';
    } else if (!connected) {
        return 'Connect to Polkadot extension';
    }
};

const getDialogBody = (detected: boolean, connected: boolean) => {
    return (
        <React.Fragment>
            <Line />
            To use CENNZX you need to install and connect to the Polkadot browser extension. If you don't have the
            extension installed you can download it
            <Link to="https://polkadot.js.org/extension/"> here</Link>
        </React.Fragment>
    );
};

const getDialogFooter = setState => (
    <>
        <BlueButton onClick={() => setState({isOpen: false})}>Close</BlueButton>
    </>
);

// extend the props excluding handled ones and including extra ones
export type AppDialogProps = Pick<DialogProps, Exclude<keyof DialogProps, 'title' | 'body' | 'footer' | 'isOpen'>> & {
    extensionConnected: boolean;
    extensionDetected: boolean;
};

const CreateAccountDialog: FC<AppDialogProps> = props => {
    const {extensionDetected, extensionConnected} = props;
    const [state, setState] = useState({isOpen: true});
    const isOpen = (!extensionDetected || !extensionConnected) && state.isOpen;

    return (
        <Dialog
            {...props}
            isOpen={isOpen}
            title={getDialogTitle(extensionDetected, extensionConnected)}
            body={getDialogBody(extensionDetected, extensionConnected)}
            footer={getDialogFooter(setState)}
        />
    );
};

export default AppDialog;
