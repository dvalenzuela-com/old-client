import { SnackbarProvider } from "notistack";
import { useState } from "react";
import Navbar from "@Components/Navbar";
import { GET_SITE_CONFIG } from "@Lib/siteConfig";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useRouter } from "next/router";

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

    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <>
            <SnackbarProvider>
                <ThemeProvider theme={theme}>
                    <Navbar title={SITE_CONFIG.TITLE} />
                    {children}
                </ThemeProvider>
            </SnackbarProvider> 
		</>
    );
}

export default Layout;