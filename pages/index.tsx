import type { NextPage } from 'next'

import ProductGrid from '@Components/ProductGrid'
import { Container, Typography } from '@mui/material';
import { useProducts } from '@Lib/firestore';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { CartContext } from '@Context/CartContext';
import { GET_SITE_CONFIG, VALID_BUSINESS_IDS } from '@Lib/siteConfig';
import Link from 'next/link';

const RootIndex: NextPage = () => {

	const router = useRouter();
	const businessId = router.query['business-id'] as string;

    return (
        <Container>
            <Typography variant='h1'>Alabarra 😍</Typography>

            <Typography variant='h4'>We are serving the following stores:</Typography>
            <ul>
                {VALID_BUSINESS_IDS.map(businessId => {
                    return <li><Link href={`/${businessId}`}>{GET_SITE_CONFIG(businessId).TITLE}</Link></li>
                })}
            </ul>
        </Container>
    )
}

export default RootIndex