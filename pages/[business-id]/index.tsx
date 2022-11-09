import type { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from 'next'

import ProductGrid from '@Components/ProductGrid'
import { Container } from '@mui/material';
import { allProductsQuery, getAllBusinessIds, getBusinessConfig, useProducts } from '@Lib/firestore';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { CartContext, CartProvider } from '@Context/CartContext';
import Layout from 'layout/Layout';
import { getDocs } from 'firebase/firestore';
import { ABBusinessConfig, ABProduct } from '@dvalenzuela-com/alabarra-types';
import { NextSeo } from 'next-seo';
import { title } from 'process';

const Index: NextPage<{products: ABProduct[], businessConfig: ABBusinessConfig}> = ({products, businessConfig}) => {

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
					<ProductGrid products={products}></ProductGrid>
				</Container>
			</Layout>
		</>

  	)
}

export default Index;

 

export const getStaticProps: GetStaticProps = async (context) => {
	
    const businessId = (context.params as any)['business-id'] as string;

	// Testing SSR
	const allProducts = (await getDocs(allProductsQuery(businessId))).docs.map(doc => doc.data());
	const businessConfig = await getBusinessConfig(businessId);

	return {
        props: {
			products: JSON.parse(JSON.stringify(allProducts)),
			businessConfig: businessConfig
		}
    }
}

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