import type { NextPage } from 'next'

import Navbar from '../components/Navbar'

import { useCollectionData } from "react-firebase-hooks/firestore";

import { AlabarraProduct } from 'alabarra-types';
import { Autocomplete, Button, Container, FormLabel, Grid, List, ListItem, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import CartContent from '../components/CartContent';
import { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { allProductsQuery, getAllTableIds } from '../lib/firestore';


const Cart: NextPage = () => {

	const [tables, setTables] = useState<String[]>([])
  	// Fetch all orders
	const [products, productsLoading, productsError, productsSnapshot] = useCollectionData<AlabarraProduct>(allProductsQuery, {
		snapshotListenOptions: { includeMetadataChanges: true }
	});


	useEffect( () => {
	// Fetch all available tables
		(async () => {
			setTables(await getAllTableIds());
		})()
	}, [])

  return (
    <>
        <Navbar />
        <Container>
            <h1>Checkout</h1>

			<Grid container spacing={5} direction='row' justifyContent='flex-start' alignItems='stretch'>
				<Grid item xs={12} sm={6} md={6} lg={6}>
					
					<h2>Select payment method</h2>
					<RadioGroup>
						<List>
							<ListItem key='1'>
								<Radio value='presential' />
									<Typography><Box display='inline' fontWeight='bold' component='span'>Presential payment</Box>: A waiter will come to your table to collect payment</Typography>
									

							</ListItem>
							<ListItem key='2'>
								<Radio value='online' disabled />
								<FormLabel disabled><Box display='inline' fontWeight='bold' component='span'>Online payment</Box>: Pay from the comfort of your phone and get your order sooner</FormLabel>
							</ListItem>
						</List>
					</RadioGroup>

					<h2>Select your table</h2>
					<Autocomplete
						disablePortal
						id="select-table"
						options={tables}
						
						renderInput={(params) => <TextField {...params} label="Select your table" variant="standard"/>}
					/>
					<h2>Your name</h2>
					<TextField></TextField>
				</Grid>

				<Grid item xs={12} sm={6} md={6} lg={6}>
					<h2>Order summary</h2>
					<CartContent />

					<h2>Place order</h2>
					<Button>Place order</Button>

				</Grid>
			</Grid>
        </Container>
    </>
  )
}

export default Cart
