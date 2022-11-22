import type { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from 'next'

import ProductGrid from '@Components/ProductGrid'
import { Box, Container } from '@mui/material';
import { allCategoriesQuery, allProductsQuery, getAllBusinessIds, getBusinessConfig } from '@Lib/firestore';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { CartContext } from '@Context/CartContext';
import Layout from 'layout/Layout';
import { getDocs } from 'firebase/firestore';
import { ABBusinessConfig, ABCategory, ABProduct } from '@dvalenzuela-com/alabarra-types';
import { NextSeo } from 'next-seo';
import { dummyAllProducts } from './../../lib/offlineTesting/dummyAllProducts';
import { dummyAllCategories } from '../../lib/offlineTesting/dummyAllCategories';
import { dummyBusinessConfig } from './../../lib/offlineTesting/dummyBusinessConfig';

const Index: NextPage<{categories: ABCategory[], products: ABProduct[], businessConfig: ABBusinessConfig}> = ({categories, products, businessConfig}) => {

	const router = useRouter();
	const businessId = router.query['business-id'] as string;

	const cart = useContext(CartContext);
	const selectedTable = router.query['t'] as string;
	
	
	useEffect(() => {
		if (selectedTable && selectedTable.trim().length > 0) {
			cart.setSelectedTableId(selectedTable);
		}
	}, [selectedTable]);

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
				<Container>
					<ProductGrid categories={categories} products={products}></ProductGrid>
				</Container>
			</Layout>
		</>

  	)
}

export default Index;

/**
 * STATIC SITE GENERATION 
 */

// Statically generate all product pages for all existing businessess
// TODO: Add revalidate when creating a new business and/or when changing products
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
	
	/*
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
*/
	//const allProducts = (await getDocs(allProductsQuery(businessId))).docs.map(doc => doc.data());
	//const allCategories = (await getDocs(allCategoriesQuery(businessId))).docs.map(doc => doc.data());
	//const businessConfig = await getBusinessConfig(businessId);

	const allProducts = dummyAllProducts;
	const allCategories = dummyAllCategories;
	const businessConfig = dummyBusinessConfig;

	console.log(allCategories);
	console.log(allProducts);
	console.log(businessConfig);
	return {
        props: {
			categories: JSON.parse(JSON.stringify(allCategories)),
			products: JSON.parse(JSON.stringify(allProducts)),
			businessConfig: businessConfig
		}
    }
}


/**
 * SERVER SIDE RENDERING 
 */

// export const getServerSideProps: GetServerSideProps = async (context) => {
	
//     const businessId = context.query['business-id'] as string;
	
// 	// Redirect wrong business Ids to main page
// 	const businessesIds = await getAllBusinessIds();
//     if (businessId && !businessesIds.includes(businessId)) {
//         return {
//             redirect: {
//                 permanent: true,
//                 destination: "/"
//             },
//             props: {}
//         }
//     }

// 	// Fetch data about the business
// 	/*
// 	context.res.setHeader(
// 		'Cache-Control',
// 		'public, s-maxage=300'
// 	);
// 	*/

// 	const allProducts = (await getDocs(allProductsQuery(businessId))).docs.map(doc => doc.data());
// 	const allCategories = (await getDocs(allCategoriesQuery(businessId))).docs.map(doc => doc.data());
// 	const businessConfig = await getBusinessConfig(businessId);

// 	return {
//         props: {
// 			categories: JSON.parse(JSON.stringify(allCategories)),
// 			products: JSON.parse(JSON.stringify(allProducts)),
// 			businessConfig: businessConfig
// 		}
//     }
// }
