import { AppBar, Badge, IconButton, Link, Toolbar, Tooltip } from "@mui/material";
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import { useCart } from "@Context/CartContext";
import NextLink from 'next/link'
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

type NavbarProps = {
    title: string;
}

const Navbar = (props: NavbarProps) => {

    const { t } = useTranslation();

    const router = useRouter();
	const businessId = router.query['business-id'] as string;
    const cart = useCart();

    return (
        <AppBar position="sticky">
            <Toolbar>
                <NextLink href={{ pathname: '/[bid]', query: { "bid": businessId } }} passHref>
                    <Link variant='h6' sx={{ flexGrow: 1 }} color="inherit">{props.title}</Link>
                </NextLink>
                <Tooltip title={t('Navbar.Tooltip.Title')}>
                    <NextLink href={{ pathname: '/[bid]/cart', query: { "bid": businessId } }} passHref>
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