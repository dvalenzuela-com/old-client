import type { NextPage } from 'next'

import ProductGrid from '@Components/ProductGrid'
import { Container } from '@mui/material';
import { useProducts } from '@Lib/firestore';

const Index: NextPage = () => {

  	// Fetch all orders
	  const [products, productsLoading, productsError, productsSnapshot] = useProducts();
  
  return (
	<Container>
		<ProductGrid products={products}></ProductGrid>
	</Container>
  )
}

export default Index
