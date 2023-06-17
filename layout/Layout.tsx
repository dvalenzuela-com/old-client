import Navbar from '@Components/Navbar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Footer from '@Components/Footer';
import { ABBusinessConfig } from '@Alabarra/alabarra-types';
import { BusinessConfigContext } from '@Context/BusinessConfigContext';
import './../i18n';
import i18n from './../i18n';
import { Box, Typography } from '@mui/material';
import { useStoreOpen } from '@Lib/useStoreOpen';
import { CartProvider } from '@Context/CartContext';
import { useEffect } from 'react';

type LayoutProps = {
  children: React.ReactNode;
  businessConfig: ABBusinessConfig;
};

const Layout = ({ children, businessConfig }: LayoutProps) => {
  const storeOpen = useStoreOpen(businessConfig);

  useEffect(() => {
    // Use the store language
    if (i18n.language != businessConfig.main_language) {
      i18n.changeLanguage(businessConfig.main_language);
    }
  }, []);

  const theme = createTheme({
    palette: businessConfig.palette,
  });

  // TODO: move to a dir de estilos
  const style = {
    backgroundColor: 'black',
    color: 'white',
    textAlign: 'center',
    top: { xs: '56px', md: '64px' }, //TODO: Correct case for landscape
    position: 'sticky',
    zIndex: 1,
  };

  return (
    <BusinessConfigContext.Provider value={businessConfig}>
      <CartProvider businessId={businessConfig.id}>
        <ThemeProvider theme={theme}>
          <Box>
            <Navbar title={businessConfig.business_name} />
            {!storeOpen && (
              <Box sx={style}>
                <Typography sx={{ pt: 1, pb: 1 }}>Store is Closed. Cart is disabled.</Typography>
              </Box>
            )}
            {children}
            <Footer />
          </Box>
        </ThemeProvider>
      </CartProvider>
    </BusinessConfigContext.Provider>
  );
};

export default Layout;
