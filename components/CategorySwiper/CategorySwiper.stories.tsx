import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import CategorySwiper, { HeaderData } from "./CategorySwiper";


const dummyCategories: HeaderData[] = [
    {id: 'a', title: "Burgers"},
    {id: 'b', title: "Vegan Burgers"},
    {id: 'c', title: "Salads"},
    {id: 'd', title: "Fried chicken"},
    {id: 'e', title: "Cocktails"},
    {id: 'f', title: "Non-alcoholic"},
    {id: 'g', title: "Combos"},
    {id: 'h', title: "Desserts"},
]

export default {
    component: CategorySwiper,
    args: {
        categories: dummyCategories,
    }
} as ComponentMeta<typeof CategorySwiper>;



const Template: ComponentStory<typeof CategorySwiper> = (args) => <CategorySwiper {...args} />;

//👇 Each story then reuses that template
export const Primary = Template.bind({});
