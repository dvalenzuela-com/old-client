import { ABBusinessConfig, ABBusinessConfigCountry, ABBusinessConfigCurrency } from "@dvalenzuela-com/alabarra-types";
import { faker } from "@faker-js/faker";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import CurrencyText from "./CurrencyText";

const euroValue = Number(faker.commerce.price(5.5, 150, 2));
const euroBC: Partial<ABBusinessConfig> = {
    country: ABBusinessConfigCountry.DE,
    currency: ABBusinessConfigCurrency.EUR,
}

const clpValue = Number(faker.commerce.price(500, 90000, 0));
const clpBC: Partial<ABBusinessConfig> = {
    country: ABBusinessConfigCountry.CL,
    currency: ABBusinessConfigCurrency.CLP,
}

export default {
    component: CurrencyText,
    args: {
        value: euroValue,
        businessConfig: euroBC as ABBusinessConfig
    }
} as ComponentMeta<typeof CurrencyText>;

const Template: ComponentStory<typeof CurrencyText> = (args) => <CurrencyText {...args} />;

//👇 Each story then reuses that template
export const Euro = Template.bind({});

export const ChileanPeso = Template.bind({});
ChileanPeso.args = {
    value: clpValue,
    businessConfig: clpBC as ABBusinessConfig,
}
