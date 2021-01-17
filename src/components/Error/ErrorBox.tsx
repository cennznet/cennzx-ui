import React, {FC, PropsWithChildren} from 'react';
import styled from 'styled-components';

interface BoxProps {
    center: boolean;
}

const Box = styled.ul<BoxProps>`
    list-style-type: none;
    max-height: 100px;
    color: #eb161e;
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    overflow-y: scroll;
    padding: 0px;
    text-align: ${props => (props.center.toString() === 'true' ? 'center' : 'left')};
`;

interface ErrorBoxProps {
    errors?: Error[];
    center?: boolean;
}

// FIXME: handle i18n for errors here
const ErrorBox: FC<PropsWithChildren<ErrorBoxProps>> = ({errors, children, center = false}) => (
    <Box center={center}>{errors ? errors.map(err => <li key={err.message}>{err.message}</li>) : children}</Box>
);

export default ErrorBox;
