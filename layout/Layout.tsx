import { useState } from "react";
import Navbar from "@Components/Navbar";
import { GET_SITE_CONFIG } from "@Lib/siteConfig";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

type LayoutProps = {
    children: React.ReactNode
}
const Layout = ({ children }: LayoutProps) => {

    const { t } = useTranslation();

    const router = useRouter();
	const businessId = router.query['business-id'] as string;
    
    const SITE_CONFIG = GET_SITE_CONFIG(businessId);

    const theme = createTheme({
        palette: {
            primary: SITE_CONFIG.PRIMARY_COLOR
        }
    });

    const [impressumOpen, setImpressumOpen] = useState(false);
    const [legalsOpen, setLegalsOpen] = useState(false);

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
    return (
        <>
            <ThemeProvider theme={theme}>
                <Navbar title={SITE_CONFIG.TITLE} />
                {children}

                <Grid container direction="row" justifyContent="space-between" alignItems="center" padding={4}>
                    <Grid item>
                        <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                            <Grid item>
                                {t('Layout.PoweredBy')}
                            </Grid>
                            <Grid item>
                                <img src="/logo-4-white.png" height={32} style={{marginTop: 6}} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginX={3} spacing={2}>
                            <Grid item>
                                <Button onClick={() => {setImpressumOpen(true)}}>{t('Layout.Impressum')}</Button>
                            </Grid>
                            <Grid item>
                                <Button onClick={() => {setLegalsOpen(true)}}>{t('Layout.Legals')}</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Modal open={impressumOpen} onClose={() => {setImpressumOpen(false)}}>
                    <Box sx={style}>
                        <Typography variant="h6" component="h2">
                            Angaben gemäß § 5 TMG
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            Daniel Valenzuela, Kuhstr. 35, 38100 Braunschweig. inbox@dvalenzuela.com
                        </Typography>
                    </Box>
                </Modal>

                <Modal open={legalsOpen} onClose={() => {setLegalsOpen(false)}}>
                    <Box sx={style}>
                        <Typography variant="h6" component="h2">
                            Legals, including EULA and Privacy Policy
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            This is a prototype, not meant for public use. Please leave now. Thanks. 
                        </Typography>
                    </Box>
                </Modal>
            </ThemeProvider>
		</>
    );
      
}



export default Layout;