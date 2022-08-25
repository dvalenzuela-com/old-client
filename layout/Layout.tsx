import { SnackbarProvider } from "notistack";
import { useState } from "react";
import Navbar from "../components/Navbar";

type LayoutProps = {
    children: React.ReactNode
}
const Layout = ({ children }: LayoutProps) => {

    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <>
            <SnackbarProvider>
                <Navbar />
                {children}
            </SnackbarProvider> 
		</>
    );
}

export default Layout;