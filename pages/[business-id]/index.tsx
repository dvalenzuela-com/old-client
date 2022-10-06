import type { NextPage } from 'next'

import ProductGrid from '@Components/ProductGrid'
import { Container } from '@mui/material';
import { useProducts } from '@Lib/firestore';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { CartContext } from '@Context/CartContext';

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
	<Container>
		<ProductGrid products={products}></ProductGrid>
	</Container>
  )
}

export default Index
