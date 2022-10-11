import type { GetServerSideProps, NextPage } from 'next'

import ProductGrid from '@Components/ProductGrid'
import { Container } from '@mui/material';
import { getAllBusinessIds, useProducts } from '@Lib/firestore';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { CartContext, CartProvider } from '@Context/CartContext';
import { VALID_BUSINESS_IDS } from '@Lib/siteConfig';
import Layout from 'layout/Layout';

const Index: NextPage = () => {

	const router = useRouter();
	const businessId = router.query['business-id'] as string;

  	// Fetch all orders
	const [products, productsLoading, productsError, productsSnapshot] = useProducts(businessId);

	const cart = useContext(CartContext);
	const selectedTable = router.query['t'] as string;

	useEffect(() => {
		if (selectedTable && selectedTable.trim().length > 0) {
			cart.setSelectedTableId(selectedTable);
		}
	}, [selectedTable]);

  	return (
		<Layout>
			<Container>
				<ProductGrid products={products}></ProductGrid>
			</Container>
		</Layout>

  	)
}

export default Index


export const getServerSideProps: GetServerSideProps = async (context) => {

	context.res.setHeader(
		'Cache-Control',
		'public, s-maxage=60'
	);

    const businessId = context.query['business-id'] as string;
	
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

    return {
        props: {}
    }
}
