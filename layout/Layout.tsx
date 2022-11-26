import Navbar from "@Components/Navbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Footer from "@Components/Footer";
import { ABBusinessConfig } from "@dvalenzuela-com/alabarra-types";
import { BusinessConfigContext } from "@Context/BusinessConfigContext";
import './../i18n';
import i18n from "./../i18n";
import { Box, Typography } from "@mui/material";
import { isStoreOpen } from "@Lib/helper";

type LayoutProps = {
    children: React.ReactNode,
    businessConfig: ABBusinessConfig
}

const Layout = ({ children, businessConfig }: LayoutProps) => {

    if(i18n.language != businessConfig.main_language) {
        i18n.changeLanguage(businessConfig.main_language);
    }

    const theme = createTheme({
        palette: businessConfig.palette
    });

    return (
        <BusinessConfigContext.Provider value={businessConfig}>
            <ThemeProvider theme={theme}>
                <Box>
                    <Navbar title={businessConfig.business_name} />
                    {!isStoreOpen(businessConfig) && <Box sx={{
                        backgroundColor:"black",
                        color: "white",
                        textAlign:'center',
                        top: {xs:'56px', md: '64px'}, //TODO: Correct case for landscape
                        position: 'sticky',
                        zIndex: 1}}>
                            <Typography sx={{pt: 1, pb: 1}}>Store is Closed. Cart is disabled.</Typography>
                    </Box>}
                    {children}
                    <Footer />
                </Box>
            </ThemeProvider>
        </BusinessConfigContext.Provider>
    );
}

export default Layout;
