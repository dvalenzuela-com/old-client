import type { NextPage } from 'next'
import { Container, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { GET_SITE_CONFIG, VALID_BUSINESS_IDS } from '@Lib/siteConfig';
import Link from 'next/link';
import Footer from '@Components/Footer';

const RootIndex: NextPage = () => {

	const router = useRouter();
	const businessId = router.query['business-id'] as string;

    return (
        <Container>
            <Typography variant='h1'>Alabarra 😍</Typography>

            <Typography variant='h4'>We are serving the following stores:</Typography>
            <ul>
                {VALID_BUSINESS_IDS.map(businessId => {
                    return <li key={businessId}><Link href={`/${businessId}`}>{GET_SITE_CONFIG(businessId).TITLE}</Link></li>
                })}
            </ul>
            <Footer />
        </Container>
    )
}

export default RootIndex
