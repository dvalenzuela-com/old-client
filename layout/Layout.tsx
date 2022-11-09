import Navbar from "@Components/Navbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Footer from "@Components/Footer";
import { ABBusinessConfig } from "@dvalenzuela-com/alabarra-types";
import { BusinessConfigContext } from "@Context/BusinessConfigContext";
import './../i18n';
import i18n from "./../i18n";

type LayoutProps = {
    children: React.ReactNode,
    businessConfig: ABBusinessConfig
}

const Layout = ({ children, businessConfig }: LayoutProps) => {

    if(i18n.language != businessConfig.main_language) {
        i18n.changeLanguage(businessConfig.main_language);
    }
    
    const theme = createTheme({
        palette: {
            ...businessConfig.colors
        }
    });
    
    return (
        <>
            <BusinessConfigContext.Provider value={businessConfig}>
                <ThemeProvider theme={theme}>
                    <Navbar title={businessConfig.business_name} />
                    {children}
                    <Footer />
                </ThemeProvider>
            </BusinessConfigContext.Provider>
		</>
    );
      
}



export default Layout;