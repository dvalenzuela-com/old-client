import type { NextPage } from 'next'

import Navbar from '../components/Navbar'
import ProductGrid from '../components/ProductGrid'
import { Container } from '@mui/material';
import { useProducts } from '../lib/firestore';


const Home: NextPage = () => {

  	// Fetch all orders
	  const [products, productsLoading, productsError, productsSnapshot] = useProducts();
  
  return (
	<Container>
		<ProductGrid products={products}></ProductGrid>
	</Container>
  )
}

export default Home
