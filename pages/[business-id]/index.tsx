import type { GetServerSideProps, NextPage } from 'next'

import ProductGrid from '@Components/ProductGrid'
import { Container } from '@mui/material';
import { allProductsQuery, getAllBusinessIds, useProducts } from '@Lib/firestore';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { CartContext, CartProvider } from '@Context/CartContext';
import { VALID_BUSINESS_IDS } from '@Lib/siteConfig';
import Layout from 'layout/Layout';
import { getDocs } from 'firebase/firestore';
import { ABProduct } from '@dvalenzuela-com/alabarra-types';

const Index: NextPage<{products: ABProduct[]}> = ({products}) => {

	const router = useRouter();
	const businessId = router.query['business-id'] as string;

	// Testing SSR
	//const [products, productsLoading, productsError, productsSnapshot] = useProducts(businessId);

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

	// Testing SSR
	const allProducts = (await getDocs(allProductsQuery(businessId))).docs.map(doc => doc.data());
    return {
        props: {products: JSON.parse(JSON.stringify(allProducts))}
    }
}
