import {BlueButton, RedButton} from 'components/Dialog/DialogButtons';
import TransparentButton from 'components/TransparentButton';
import React, {FC, useState} from 'react';
import {Stages} from '../../../redux/reducers/ui/txDialog.reducer';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';

const FooterForSigning: FC<{isAccountLocked?: string; error?: Error; onClose(): void; onSubmit(): void}> = ({
    isAccountLocked,
    error,
    onClose,
    onSubmit,
}) => {
    const [password, setPassword] = useState('');
    let [loading, setLoading] = useState(false);

    return error ? (
        <RedButton onClick={onClose}>Close</RedButton>
    ) : (
        <>
            {isAccountLocked && (
                <p>
                    <label>unlock account with password:</label>
                    <input
                        type={'password'}
                        onChange={element => {
                            const pass = element.currentTarget.value;
                            setPassword(pass);
                        }}
                    />
                </p>
            )}
            <p>
                <div>
                    <ClipLoader loading={loading} size={25} />
                </div>
                <TransparentButton onClick={onClose}>Cancel</TransparentButton>
                <BlueButton
                    disabled={isAccountLocked === true && password === ''}
                    onClick={element => {
                        setLoading(true);
                        onSubmit(password);
                    }}
                >
                    Authorise Transaction
                </BlueButton>
            </p>
        </>
    );
};
const FooterForBroadcasted: FC<{onClick(): void}> = ({onClick}) => <BlueButton onClick={onClick}>Close</BlueButton>;

const FooterForFinalised: FC<{success: boolean; onClick(): void}> = ({success, onClick}) =>
    success ? <BlueButton onClick={onClick}>Close</BlueButton> : <RedButton onClick={onClick}>Close</RedButton>;
const FootBox = styled.div`
    display: flex;
    justify-content: flex-end;
    flex: 2;
`;
export interface TxDialogFooterProps {
    isAccountLocked: boolean;
    stage: Stages;
    error?: Error;
    success?: boolean;

    onClose(): void;
    onSubmit(): void;
    onComplete(): void;
}

export const TxDialogFooter: FC<TxDialogFooterProps> = ({
    isAccountLocked,
    error,
    stage,
    success,
    onClose,
    onSubmit,
    onComplete,
}) => {
    const closeAndComplete = () => {
        onClose();
        onComplete();
    };

    switch (stage) {
        case Stages.Signing:
            return (
                <FootBox>
                    <FooterForSigning
                        isAccountLocked={isAccountLocked}
                        error={error}
                        onClose={onClose}
                        onSubmit={onSubmit}
                    />
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
