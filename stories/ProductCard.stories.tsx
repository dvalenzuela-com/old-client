import { ABProduct, ABProductStatus } from "@dvalenzuela-com/alabarra-types";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import ProductCard from "../components/ProductCard";
import { fakeProduct } from "./helpers";

const dummy_product = fakeProduct();

export default {
    component: ProductCard,
    args: {
        product: dummy_product
    }
} as ComponentMeta<typeof ProductCard>;

const Template: ComponentStory<typeof ProductCard> = (args) => <ProductCard {...args} />;

//👇 Each story then reuses that template
export const Primary = Template.bind({});
