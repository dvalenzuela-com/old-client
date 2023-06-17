import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { fakeProductOptionSingleSelection } from 'stories/helpers';
import ProductOptionSingleSelection from '.';

const option = fakeProductOptionSingleSelection();

export default {
  component: ProductOptionSingleSelection,
  args: {
    index: 0,
    productOption: option,
    onOptionChange: (selectedOption) => {
      console.log(selectedOption);
    },
  },
} as ComponentMeta<typeof ProductOptionSingleSelection>;

const Template: ComponentStory<typeof ProductOptionSingleSelection> = (args) => (
  <ProductOptionSingleSelection {...args} />
);

//👇 Each story then reuses that template
export const Default = Template.bind({});

export const PreselectedOption = Template.bind({});
PreselectedOption.args = {
  selectedOption: {
    option_id: option.id,
    selected_value: option.possible_values[0].id,
  },
};
