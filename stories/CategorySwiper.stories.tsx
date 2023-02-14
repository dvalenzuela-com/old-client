import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import CategorySwiper, { HeaderData } from "../components/CategorySwiper/CategorySwiper";


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
        activeCategoryId: "d"
    }
} as ComponentMeta<typeof CategorySwiper>;

setTimeout(() => {
    console.log("timeout")
    Primary.args = {
        activeCategoryId: 'a'
    };
}, 3*1000);

const Template: ComponentStory<typeof CategorySwiper> = (args) => <CategorySwiper {...args} />;

//👇 Each story then reuses that template
export const Primary = Template.bind({});
