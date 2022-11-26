import { SelectProps as ArcoSelectProps } from '@arco-design/web-react';
import React from 'react';
export interface SelectProps extends ArcoSelectProps {
    options: Array<{
        value: string;
        label: React.ReactNode;
    }>;
    onChange?: (val: string) => void;
    value: string;
    onChangeHandler?: (val: string) => void;
}
export declare function Select(props: SelectProps): JSX.Element;
