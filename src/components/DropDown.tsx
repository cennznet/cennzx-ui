import {Select} from 'centrality-react-core';
// import React from 'react';
import styled from 'styled-components';

const StyledSelect = styled(Select)`
    min-width: 112px;
    div {
        background-color: #ffffff;
    }
`;

/* export interface DropDownProps {
     options: Asset[];
     onChange: any;
     selected: Asset;
 }

 const DropDown: FC<DropDownProps> = ({selected, options, onChange}) => (
     <StyledSelect value={selected} options={options} onChange={picked => onChange(picked)} />
 );*/

export default StyledSelect;
