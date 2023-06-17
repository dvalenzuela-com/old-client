import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import LoadingButton from './LoadingButton';

export default {
  component: LoadingButton,
  args: {
    title: 'Button title',
  },
} as ComponentMeta<typeof LoadingButton>;

const Template: ComponentStory<typeof LoadingButton> = (args) => <LoadingButton {...args} />;

//👇 Each story then reuses that template
export const Primary = Template.bind({});

export const FullWidth = Template.bind({});
FullWidth.args = {
  fullWidth: true,
};

export const Loading = Template.bind({});
Loading.args = {
  loading: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};
