import type { GetStaticProps, NextPage } from 'next'
import { Container, Typography } from '@mui/material';
import Link from 'next/link';
import Footer from '@Components/Footer';
import { getAllBusinessConfigs } from '@Lib/firestore';
import { ABBusinessConfig } from '@Alabarra/alabarra-types';

const RootIndex: NextPage<{businessConfigs: ABBusinessConfig[]}> = ({businessConfigs}) => {

    return (
        <Container>
            <Typography variant='h1'>Alabarra 😍</Typography>

            <Typography variant='h4'>We are serving the following stores:</Typography>
            <ul>
                {businessConfigs.map(businessConfig => {
                    return <li key={businessConfig.id}><Link href={`/${businessConfig.id}`}>{businessConfig.business_name}</Link></li>
                })}
            </ul>
            <Footer />
        </Container>
    )

}

export default RootIndex

/**
 * STATIC SITE GENERATION 
 */

// statically generate pages
export const getStaticProps: GetStaticProps = async (context) => {
	
	const businessConfigs = await getAllBusinessConfigs();

	return {
        props: {
			businessConfigs: businessConfigs
		}
    }
}

/**
 * SERVER SIDE RENDERING 
 */

// export const getServerSideProps: GetServerSideProps = async (context) => {
	
//     // Fetch all businesses
// 	const businessConfigs = await getAllBusinessConfigs();

// 	return {
//         props: {
// 			businessConfigs: businessConfigs
// 		}
//     }
// }
