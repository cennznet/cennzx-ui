// @ts-ignore
import {Checkbox} from 'centrality-react-core';
import Box from 'components/Box';
import Page from 'components/Page';
import React from 'react';
import {withRouteData} from 'react-static';

export default withRouteData(() => (
    <Page>
        <p>React Static is a progressive static site generator for React.</p>
        <Checkbox variant="danger">Danger</Checkbox>

        <div>
            <div>
                <Box />
                <Checkbox />
            </div>
        </div>
    </Page>
));
