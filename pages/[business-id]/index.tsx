import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import ProductGrid from '@Components/ProductGrid/ProductGrid'
import { allCategoriesQuery, allProductsQuery, getAllBusinessIds, getBusinessConfig } from '@Lib/firestore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCart } from '@Context/CartContext';
import Layout from 'layout/Layout';
import { getDocs } from 'firebase/firestore';
import { ABBusinessConfig, ABCategory, ABProduct } from '@Alabarra/alabarra-types';
import { NextSeo } from 'next-seo';
//const fs = require('fs');

//import { dummyAllProducts } from './../../lib/offlineTesting/dummyAllProducts';
//import { dummyAllCategories } from '../../lib/offlineTesting/dummyAllCategories';
//import { dummyBusinessConfig } from './../../lib/offlineTestingdummyBusinessConfig';

type IndexProps = {
	categories: ABCategory[];
	products: ABProduct[];
	businessConfig: ABBusinessConfig;
}

const Index: NextPage<IndexProps> = ({categories, products, businessConfig}) => {

	const router = useRouter();
	const selectedTable = router.query['t'] as string;

	const cart = useCart();

	useEffect(() => {
		if (selectedTable && selectedTable.trim().length > 0) {
			cart.setSelectedTableId(selectedTable);
		}
	}, [cart, selectedTable]);

  	return (
		<>
			<NextSeo
				title={businessConfig.business_name}
				description={`Order and pay online from ${businessConfig.business_name} and get your food & drinks super fast!`}
				openGraph={{
					title: businessConfig.business_name,
					description: `Order and pay online from ${businessConfig.business_name} and get your food & drinks super fast!`,
				}}
			/>
			<Layout businessConfig={businessConfig}>
				<ProductGrid categories={categories} products={products}></ProductGrid>
			</Layout>
		</>

  	)
}

export default Index;

/**
 * STATIC SITE GENERATION 
 */

// Statically generate all product pages for all existing businessess
export const getStaticPaths: GetStaticPaths = async () => {
	
	const businessesIds = await getAllBusinessIds();

	const paths = businessesIds.map(businessId => {
		return {
			params: {'business-id': businessId}
		}
	});

	return {
		paths,
		fallback: 'blocking'
	}
}

// statically generate pages
export const getStaticProps: GetStaticProps = async (context) => {
	
	
    const businessId = (context.params as any)['business-id'] as string;
	const businessesIds = await getAllBusinessIds();

	if (businessId && !businessesIds.includes(businessId)) {
        return {
            redirect: {
                permanent: true,
                destination: "/"
            },
            props: {}
        }
    }

	const allProducts = (await getDocs(allProductsQuery(businessId))).docs.map(doc => doc.data());
	const allCategories = (await getDocs(allCategoriesQuery(businessId))).docs.map(doc => doc.data());
	const businessConfig = await getBusinessConfig(businessId);

	//fs.writeFileSync("./allProducts.json", JSON.stringify(allProducts, null, 4));
	//fs.writeFileSync("./allCategories.json", JSON.stringify(allCategories, null, 4));
	//fs.writeFileSync("./businessConfig.json", JSON.stringify(businessConfig, null, 4));

	// const allProducts = dummyAllProducts;
	// const allCategories = dummyAllCategories;
	// const businessConfig = dummyBusinessConfig;

	return {
        props: {
			categories: JSON.parse(JSON.stringify(allCategories)),
			products: JSON.parse(JSON.stringify(allProducts)),
			businessConfig: businessConfig
		}
    }
}
