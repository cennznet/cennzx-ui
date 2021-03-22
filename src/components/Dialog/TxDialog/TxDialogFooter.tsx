import {BlueButton, RedButton} from 'components/Dialog/DialogButtons';
import TransparentButton from 'components/TransparentButton';
import React, {FC, useState} from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import styled from 'styled-components';
import {Stages} from '../../../redux/reducers/ui/txDialog.reducer';

const Loading = styled(ClipLoader)`
    border-color: white !important;
    min-width: 10rem !important;
`;

const CancelButton = styled(TransparentButton)`
    margin-bottom: 0.2rem;
`;

const FooterForSigning: FC<{error?: Error; onClose(): void; onSubmit(): void}> = ({error, onClose, onSubmit}) => {
    const [loading, setLoading] = useState(false);
    return error ? (
        <RedButton onClick={onClose}>Close</RedButton>
    ) : (
        <>
            <TransparentButton onClick={onClose}>Cancel</TransparentButton>
            <BlueButton
                onClick={element => {
                    setLoading(true);
                    onSubmit();
                }}
            >
                {loading ? <Loading size={25} /> : 'Authorise Transaction'}
            </BlueButton>
        </>
    );
};

const FooterForBroadcasted: FC<{onClick(): void}> = ({onClick}) => <BlueButton onClick={onClick}>Close</BlueButton>;

const FooterForFinalised: FC<{success: boolean; onClick(): void}> = ({success, onClick}) =>
    success ? <BlueButton onClick={onClick}>Close</BlueButton> : <RedButton onClick={onClick}>Close</RedButton>;
const FootBox = styled.div`
    display: flex;
    justify-content: flex-end;
    flex: 1;
`;
export interface TxDialogFooterProps {
    stage: Stages;
    error?: Error;
    success?: boolean;

    onClose(): void;
    onSubmit(): void;
    onComplete(): void;
}

export const TxDialogFooter: FC<TxDialogFooterProps> = ({error, stage, success, onClose, onSubmit, onComplete}) => {
    const closeAndComplete = () => {
        onClose();
        onComplete();
    };

    switch (stage) {
        case Stages.Signing:
            return (
                <FootBox>
                    <FooterForSigning error={error} onClose={onClose} onSubmit={onSubmit} />
                </FootBox>
            );
        case Stages.Broadcasted:
            return (
                <FootBox>
                    <FooterForBroadcasted onClick={closeAndComplete} />
                </FootBox>
            );
        case Stages.Finalised:
            return (
                <FootBox>
                    <FooterForFinalised onClick={closeAndComplete} success={success} />
                </FootBox>
            );
        default:
            return <></>;
    }
};
