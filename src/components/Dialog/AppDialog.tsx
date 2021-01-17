import {Link} from '@reach/router';
import React, {FC, useState} from 'react';
import Dialog, {DialogProps} from './Dialog';
import {BlueButton} from './DialogButtons';

const getDialogTitle = (detected: boolean, connected: boolean) => {
    if (!detected) {
        return 'Connect to SingleSource';
    } else if (!connected) {
        return 'Connect to SingleSource';
    }
};

const getDialogBody = (detected: boolean, connected: boolean) => {
    if (!detected) {
        return (
            <React.Fragment>
                `To use CENNZX you need to install and connect to the SingleSource browser extension. If you don't have
                the extension installed you can download it `;
                <Link to="https://bitbucket.org/centralitydev/singlesourceextension/src/develop/">here</Link>
            </React.Fragment>
        );
    } else if (!connected) {
        return 'To use CENNZX you need to connect to the SingleSource browser extension.';
    } else {
        // 'Not detected and not  connected to extension. This should not occur';
        return '';
    }
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

const AppDialog: FC<AppDialogProps> = props => {
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
