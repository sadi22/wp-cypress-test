import {
    IBlockData,
    BasicType,
    components,
    createCustomBlock,
    getPreviewClassName,
    AdvancedType,
} from 'easy-email-core';

import { CustomBlocksType } from '../constant';
import React from 'react';
import { merge } from 'lodash';
import { getContentEditableClassName } from 'easy-email-editor';

const { Column, Section, Wrapper, Text, Button, Image, Group } = components;

const productPlaceholder = {
    image: 'https://assets.maocanhua.cn/8e0e07e2-3f84-4426-84c1-2add355c558b-image.png',
    title: 'Red Flock Buckle Winter Boots',
    price: '$59.99 HKD',
    url: 'https://easy-email-m-ryan.vercel.app',
};


export type IProductBlock = IBlockData<
    {
        'background-color': string;
        'button-color': string;
        'button-text-color': string;
        'product-name-color': string;
        'product-price-color': string;
        'title-color': string;
    },
    {
        title: string;
        buttonText: string;
        quantity: number;
        testField: string
    }
    >;


export const ProductBlock = createCustomBlock<IProductBlock>({
    name: 'Product Block',
    type: CustomBlocksType.PRODUCT_BLOCK,
    validParentType: [BasicType.PAGE, AdvancedType.WRAPPER, BasicType.WRAPPER],
    create: payload => {
        const defaultData: IProductBlock = {
            type: CustomBlocksType.PRODUCT_BLOCK,
            data: {
                value: {
                    title: 'You might also like',
                    buttonText: 'Buy now',
                    quantity: 3,
                },
            },
            attributes: {
                'background-color': '#ffffff',
                'button-text-color': '#ffffff',
                'button-color': '#414141',
                'product-name-color': '#414141',
                'product-price-color': '#414141',
                'title-color': '#222222',
            },
            children: [
                {
                    type: BasicType.TEXT,
                    children: [],
                    data: {
                        value: {
                            content: 'custom block title',
                        },
                    },
                    attributes: {},
                },
            ],
        };
        return merge(defaultData, payload);
    },
    render: ({ data, idx, mode, context, dataSource }) => {

        let { title, buttonText, quantity } = data.data.value;
        const attributes = data.attributes;
        const perWidth = quantity <= 3 ? '' : '33.33%';
        const productList = (dataSource?.productsList || []).slice(0, quantity);
        return (
            <Wrapper
                css-class={mode === 'testing' ? getPreviewClassName(idx, data.type) : ''}
                padding='20px 0px 20px 0px'
                border='none'
                direction='ltr'
                text-align='center'
                background-color={attributes['background-color']}
            >

                <Section padding='0px'>
                    <Group
                        vertical-align='top'
                        direction='ltr'
                    >
                        {productList.map((item, index) => (
                            <Column
                                key={index}
                                width={perWidth}
                                padding='0px'
                                border='none'
                                vertical-align='top'
                            >
                                <Image
                                    align='center'
                                    height='auto'
                                    padding='10px'
                                    width='150px'
                                    src={item?.featured_image_url}
                                />

                                <Text
                                    font-size='12px'
                                    padding='10px 0px 10px 0px '
                                    line-height='1'
                                    align='center'
                                    color={attributes['product-name-color']}
                                >
                                    {item?.title?.rendered}
                                </Text>
                                <Button
                                    align='center'
                                    padding='15px 0px'
                                    background-color={attributes['button-color']}
                                    color={attributes['button-text-color']}
                                    target='_blank'
                                    vertical-align='middle'
                                    border='none'
                                    text-align='center'
                                    href={item?.link}
                                >
                                    {buttonText}
                                </Button>
                            </Column>
                        ))}
                    </Group>
                </Section>
            </Wrapper>
        );
    },
});

export { Panel } from './Panel';
