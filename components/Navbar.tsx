import { AppBar, Badge, IconButton, Link, Toolbar, Tooltip } from "@mui/material";
import { useContext } from "react";
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import { CartContext } from "@Context/CartContext";
import NextLink from 'next/link'

const Navbar = (props: any) => {
    const cart = useContext(CartContext)
    return (
        <AppBar position="sticky">
            <Toolbar>
                <NextLink href="/" passHref>
                    <Link variant='h6' sx={{ flexGrow: 1 }} color="inherit">Alabarra.com</Link>
                </NextLink>
                <Tooltip title='Checkout'>
                    <NextLink href="/cart" passHref>
                        <IconButton>
                            <Badge badgeContent={cart.getNumberOfItems()} color='secondary'>
                                <ShoppingCartRoundedIcon />
                            </Badge>
                        </IconButton>
                    </NextLink>
                </Tooltip>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar;