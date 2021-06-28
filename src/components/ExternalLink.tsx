import React, {FC} from 'react';
import styled from 'styled-components';

interface ExternalLinkProps {
    url: string;
    text: string;
}

const ExternalLink: FC<ExternalLinkProps> = ({url, text}) => (
    <TruncateLink href={url} target="_new">
        {text}
    </TruncateLink>
);

export default ExternalLink;

const TruncateLink = styled.a`
     {
        display: inline-block;
        width: 43rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;
