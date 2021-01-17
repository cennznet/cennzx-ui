import React, {FC} from 'react';
import {FormSection} from '../../pages/exchange/exchange';
import {FormErrors} from '../../pages/exchange/validation';
import Space from './../Space';
import ErrorBox from './ErrorBox';

interface ErrorMessageProps {
    errors: FormErrors;
    field: FormSection;
    center?: boolean;
}

const ErrorMessage: FC<ErrorMessageProps> = ({errors, field, center}) =>
    errors.has(field) ? <ErrorBox center={center} errors={errors.get(field)}></ErrorBox> : <Space />;

export default ErrorMessage;
