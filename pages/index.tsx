import type { NextPage } from 'next'

import Navbar from '../components/Navbar'
import ProductGrid from '../components/ProductGrid'

import { useCollectionData } from "react-firebase-hooks/firestore";

import { AlabarraProduct } from 'alabarra-types';
import { Container } from '@mui/material';
import { allProductsQuery } from '../lib/firestore';


const Home: NextPage = () => {

  	// Fetch all orders
	  const [products, productsLoading, productsError, productsSnapshot] = useCollectionData<AlabarraProduct>(allProductsQuery, {
		  snapshotListenOptions: { includeMetadataChanges: true }
	  });
  
  return (
    <>
      <Navbar />
      <Container>
	  	<ProductGrid products={products}></ProductGrid>
	  </Container>
    </>
  )
}

export default Home
