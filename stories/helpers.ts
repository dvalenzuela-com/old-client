import { ABProduct, ABProductStatus } from "@dvalenzuela-com/alabarra-types"
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
    console.log(products);
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
        ...params
    }
    
    return product;
}