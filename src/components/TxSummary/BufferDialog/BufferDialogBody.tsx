import React, {FC} from 'react';
import styled from 'styled-components';
import {Amount} from '../../../util/Amount';
import {SWAP_INPUT} from '../../../util/extrinsicUtil';
import NumberPicker from '../../NumberPicker';
import BufferAsWholeNumber from './BufferAsWholeNumber';

const DialogBodyHeading = styled.div`
    margin-bottom: 24px;
`;

interface BufferDialogBodyProps {
    buffer: number;
    onBufferChange: (newAsset: number) => void;
    fromAssetAmount: Amount;
    toAssetAmount: Amount;
    extrinsic: string;
    fromAsset: number;
    toAsset: number;
    defaultBuffer: number;
    minBuffer: number;
}
const BufferDialogBody: FC<BufferDialogBodyProps> = ({
    defaultBuffer,
    buffer,
    fromAssetAmount,
    fromAsset,
    toAssetAmount,
    toAsset,
    onBufferChange,
    extrinsic,
    minBuffer,
}) => {
    return (
        <>
            <DialogBodyHeading>
                A buffer is the percentage amount that your transaction may fluctuate by. Setting a buffer will make
                sure that the estimated exchange doesn’t go too far above, or below the original value that has been
                set.
                <br />
                <br />
                {extrinsic === SWAP_INPUT ? (
                    <>This transaction will fail if the sell value falls below</>
                ) : (
                    <>This transaction will fail if the buy value goes above</>
                )}
            </DialogBodyHeading>

            <NumberPicker
                options={[
                    {
                        display: `${defaultBuffer}% (suggested)`,
                        value: defaultBuffer,
                    },
                ]}
                max={1000}
                value={buffer}
                suffix="%"
                onChange={onBufferChange}
                step={0.01}
                min={minBuffer}
            />
            <BufferAsWholeNumber
                buffer={buffer}
                fromAsset={fromAsset}
                fromAssetAmount={fromAssetAmount}
                toAsset={toAsset}
                toAssetAmount={toAssetAmount}
                extrinsic={extrinsic}
            />
        </>
    );
};

export default BufferDialogBody;
