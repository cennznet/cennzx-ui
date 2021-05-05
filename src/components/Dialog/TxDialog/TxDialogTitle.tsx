import React, {FC} from 'react';
import {Stages} from '../../../redux/reducers/ui/txDialog.reducer';

const TitleForSigning: FC<{error?: Error; title: string}> = ({error, title}) =>
    error ? <div>Error! This exchange cannot be made</div> : <div>Confirm {title}</div>;

const TitleForBroadcasted: FC<{}> = () => <div>Exchange transaction sent</div>;

const TitleForFinalised: FC<{success: boolean}> = ({success}) =>
    success ? <div>Transaction completed</div> : <div>Transaction failed</div>;

export interface TxDialogTitleProps {
    stage: Stages;
    method: string;
    title: string;
    error?: Error;
    success?: boolean;
}

export const TxDialogTitle: FC<TxDialogTitleProps> = ({error, stage, success, method, title}) => {
    switch (stage) {
        case Stages.Signing:
            return <TitleForSigning error={error} title={title} />;
        case Stages.InBlock:
            return <TitleForBroadcasted />;
        case Stages.Finalised:
            return <TitleForFinalised success={success} />;
        default:
            return <></>;
    }
};
