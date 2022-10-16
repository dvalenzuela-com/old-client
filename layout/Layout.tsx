import Navbar from "@Components/Navbar";
import { GET_SITE_CONFIG } from "@Lib/siteConfig";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import Footer from "@Components/Footer";

type LayoutProps = {
    children: React.ReactNode
}
const Layout = ({ children }: LayoutProps) => {


    const router = useRouter();
	const businessId = router.query['business-id'] as string;
    
    const SITE_CONFIG = GET_SITE_CONFIG(businessId);

    const theme = createTheme({
        palette: {
            primary: SITE_CONFIG.PRIMARY_COLOR
        }
    });

    return (
        <>
            <ThemeProvider theme={theme}>
                <Navbar title={SITE_CONFIG.TITLE} />
                {children}

                <Footer />
            </ThemeProvider>
		</>
    );
      
}



export default Layout;