/* eslint-disable @typescript-eslint/no-non-null-assertion  */
import { ABCategory, ABProduct } from '@Alabarra/alabarra-types';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import ProductGrid from './ProductGrid';

const dummy_cat_id = 'dummy_cat_id';

const dummy_products: ABProduct[] = [];
// const dummy_products = fakeProducts(5, { category: dummy_cat_id });

const defaultCategory: Partial<ABCategory> = {
  id: dummy_cat_id,
  title: 'Category title',
  products: dummy_products.map((p) => p.id!),
};

export default {
  component: ProductGrid,
  args: {
    products: dummy_products,
    categories: [defaultCategory],
  },
} as ComponentMeta<typeof ProductGrid>;

const Template: ComponentStory<typeof ProductGrid> = (args) => <ProductGrid {...args} />;

//👇 Each story then reuses that template
export const Primary = Template.bind({});
