import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { fakeProductOptionMultipleSelection } from "stories/helpers";
import ProductOptionMultipleSelection from "./ProductOptionMultipleSelection";

const option = fakeProductOptionMultipleSelection();

export default {
    component: ProductOptionMultipleSelection,
    args: {
        index: 0,
        productOption: option,
        onOptionChange: (selectedValues) => { console.log(selectedValues) }
    }
} as ComponentMeta<typeof ProductOptionMultipleSelection>;

const Template: ComponentStory<typeof ProductOptionMultipleSelection> = (args) => <ProductOptionMultipleSelection {...args} />;

//👇 Each story then reuses that template
export const Default = Template.bind({});
Default.args = {
    productOption: {
        ...option,
        default_values: []
    }
}

export const Min2Max3 = Template.bind({});
Min2Max3.args = {
    productOption: {
        ...option,
        default_values: [
            option.possible_values[0].id,
            option.possible_values[1].id
        ],
        min_selection: 2,
        max_selection: 3
    }
}


export const PreselectedValues = Template.bind({});
PreselectedValues.args = {
    productOption: {
        ...option,
        min_selection: 1,
        max_selection: 2
    },
    selectedValues: {
        option_id: option.id,
        selected_values: [
            option.possible_values[2].id,
            option.possible_values[4].id
        ]
    }
}
