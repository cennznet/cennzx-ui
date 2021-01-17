import React, {FC} from 'react';

interface ExternalLinkProps {
    url: string;
    text: string;
}

const ExternalLink: FC<ExternalLinkProps> = ({url, text}) => (
    <a href={url} target="_new">
        {text}
    </a>
);

export default ExternalLink;
