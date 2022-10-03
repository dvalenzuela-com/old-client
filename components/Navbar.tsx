import { AppBar, Badge, IconButton, Link, Toolbar, Tooltip } from "@mui/material";
import { useContext } from "react";
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import { CartContext } from "@Context/CartContext";
import NextLink from 'next/link'

type NavbarProps = {
    title: string;
}

const Navbar = (props: NavbarProps) => {
    const cart = useContext(CartContext)
    return (
        <AppBar position="sticky">
            <Toolbar>
                <NextLink href="/" passHref>
                    <Link variant='h6' sx={{ flexGrow: 1 }} color="inherit">{props.title}</Link>
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