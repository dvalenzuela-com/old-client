import { ABProductTag } from "@dvalenzuela-com/alabarra-types";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import { fakeProduct } from "./helpers";

const dummy_product = fakeProduct();

export default {
    component: ProductCard,
    args: {
        title: dummy_product.title,
        description: dummy_product.description,
        price: dummy_product.price,
        image_url: dummy_product.image_url,
        tags: [],
        onClick: () => {console.log('click')}
    }
} as ComponentMeta<typeof ProductCard>;

const Template: ComponentStory<typeof ProductCard> = (args) => <ProductCard {...args} />;

//👇 Each story then reuses that template
export const Primary = Template.bind({});
Primary.args = {
    tags: [
        ABProductTag.NO_GMO,
        ABProductTag.VEGAN,
        ABProductTag.NO_ADDED_SUGAR
    ]
}
export const NoTags = Template.bind({});
NoTags.args = {
    tags: []
}