import Dialog, {DialogProps} from 'components/Dialog/Dialog';
import React, {FC} from 'react';
import {Asset} from '../../../typings';
import {Amount} from '../../../util/Amount';
import BufferDialogBody from './BufferDialogBody';
import BufferDialogFooter from './BufferDialogFooter';

// extend the props excluding handled ones and including extra ones
export type BufferDialogProps = Pick<DialogProps, Exclude<keyof DialogProps, 'title' | 'body' | 'footer'>> & {
    assets: Asset[];
    onBufferChange: (buffer: number) => void;
    onClose: () => void;
    extrinsic: string;
    buffer: number;
    fromAssetAmount: Amount;
    fromAsset: number;
    toAssetAmount: Amount;
    toAsset: number;
};

interface BufferDialogState {
    buffer: number;
}

class BufferDialog extends React.Component<BufferDialogProps, BufferDialogState> {
    constructor(props) {
        super(props);
        this.state = {buffer: props.buffer};
    }

    componentWillReceiveProps(props: BufferDialogProps, state: BufferDialogState) {
        if (props.buffer !== state.buffer) {
            this.setState({buffer: props.buffer});
        }
    }

    render = () => {
        const {
            extrinsic,
            onBufferChange,
            fromAssetAmount,
            fromAsset,
            toAssetAmount,
            toAsset,
            isOpen,
            onClose,
        } = this.props;

        return (
            <Dialog
                isOpen={isOpen}
                title={<>Change buffer</>}
                body={
                    <BufferDialogBody
                        extrinsic={extrinsic}
                        buffer={this.state.buffer}
                        fromAssetAmount={fromAssetAmount}
                        fromAsset={fromAsset}
                        toAssetAmount={toAssetAmount}
                        toAsset={toAsset}
                        onBufferChange={buffer => {
                            this.setState({buffer});
                        }}
                        defaultBuffer={window.config.FEE_BUFFER}
                        minBuffer={window.config.MIN_FEE_BUFFER}
                    />
                }
                footer={
                    <BufferDialogFooter
                        message={
                            this.state.buffer > window.config.MAX_FEE_BUFFER
                                ? 'Your transaction may be frontrun'
                                : undefined
                        }
                        showContinueAnywayButton={this.state.buffer > window.config.MAX_FEE_BUFFER}
                        onConfirm={() => {
                            onBufferChange(this.state.buffer);
                        }}
                        onClose={onClose}
                    />
                }
            />
        );
    };
}

export default BufferDialog;
