import {
    ABProduct,
    ABProductOptionMultipleSelection,
    ABProductOptionSingleSelection,
    ABProductOptionsPossibleValue,
    ABProductOptionsType,
    ABProductStatus } from "@Alabarra/alabarra-types"
import { faker } from "@faker-js/faker";

/**
 * Generates a random number of products
 * @param n Number of products to generate
 * @param productParams Product properties to override with the given values
 * @returns an array with the generated fake products
 */
export const fakeProducts = (
    n: number = faker.datatype.number({'min': 2, 'max': 10}),
    productParams: Partial<ABProduct> = {}
    ) => {
    const products = (new Array(n)).fill(fakeProduct(productParams))
    return products;
}

/**
 * Generates a fake product
 * @param params Product properties to override with the given values
 * @returns fake product
 */
export const fakeProduct = (params: Partial<ABProduct> = {}): Partial<ABProduct> => {
    
    const fakeId = faker.datatype.uuid();
    const product: Partial<ABProduct> = {
        id: fakeId,
        path: fakeId,
        //created_at: undefined,
        //last_updated_at: null,
        status: ABProductStatus.ACTIVE,
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price()),
        //category: null,
        image_url: faker.image.food(),
        //options: [],
        tags: [],
        ...params
    }
    
    return product;
}

export const fakeProductOptionSingleSelection = (): ABProductOptionSingleSelection => {

    const possibleValueOne: ABProductOptionsPossibleValue = {
        id: "option_id_1_possible_value_id_1",
        title: "Papas chicas",
        price_adjustment: -200
    }
    const possibleValueTwo: ABProductOptionsPossibleValue = {
        id: "option_id_1_possible_value_id_2",
        title: "Papas medianas",
        price_adjustment: 0
    }
    const possibleValueThree: ABProductOptionsPossibleValue = {
        id: "option_id_1_possible_value_id_3",
        title: "Papas grandes",
        price_adjustment: 400
    }

    const possibleValues: ABProductOptionsPossibleValue[] = [
        possibleValueOne,
        possibleValueTwo,
        possibleValueThree
    ]
    return {
        id: "option_id_1",
        default_value: "option_id_1_possible_value_id_2",
        title: "Tamano de las papas",
        type: ABProductOptionsType.SINGLE_SELECTION,
        possible_values: possibleValues
    }
}

export const fakeProductOptionMultipleSelection = (): ABProductOptionMultipleSelection => {

    const possibleValueOne: ABProductOptionsPossibleValue = {
        id: "option_id_m1_possible_value_id_1",
        title: "Ketchup",
        price_adjustment: 0
    }
    const possibleValueTwo: ABProductOptionsPossibleValue = {
        id: "option_id_m1_possible_value_id_2",
        title: "Mostaza",
        price_adjustment: 0
    }
    const possibleValueThree: ABProductOptionsPossibleValue = {
        id: "option_id_m1_possible_value_id_3",
        title: "mayonesa",
        price_adjustment: 200
    }
    const possibleValueFour: ABProductOptionsPossibleValue = {
        id: "option_id_m1_possible_value_id_4",
        title: "Salsa bbq",
        price_adjustment: 390
    }
    const possibleValueFive: ABProductOptionsPossibleValue = {
        id: "option_id_m1_possible_value_id_5",
        title: "Guacamole",
        price_adjustment: 490
    }

    const possibleValues: ABProductOptionsPossibleValue[] = [
        possibleValueOne,
        possibleValueTwo,
        possibleValueThree,
        possibleValueFour,
        possibleValueFive
    ]

    return {
        id: "option_id_m1",
        type: ABProductOptionsType.MULTIPLE_SELECTION,
        min_selection: 0,
        max_selection: 5,
        title: "Salsas",
        default_values: [],
        possible_values: possibleValues
    }
}