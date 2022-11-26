import { BlockManager } from 'easy-email-core';
import { BlockAttributeConfigurationManager } from 'easy-email-extensions';
import { CustomBlocksType } from './constant';
import {
    Panel as ProductBlockPanel,
    ProductBlock,
} from './ProductBlock';


BlockManager.registerBlocks({
    [CustomBlocksType.PRODUCT_BLOCK]: ProductBlock,
});

BlockAttributeConfigurationManager.add({
    [CustomBlocksType.PRODUCT_BLOCK]: ProductBlockPanel,
});

