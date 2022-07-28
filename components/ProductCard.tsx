import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { AlabarraProduct } from "@dvalenzuela-com/alabarra-types";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

type ProductCardProps = {
    product: AlabarraProduct;
    onClick: () => void
}

const ProductCard = (props: ProductCardProps) => {

    const { addProduct } = useContext(CartContext);
    
    const [open, setOpen] = useState(false);

    const handleOnClick = () => {
        //addProduct(props)
        //setOpen(true)
        props.onClick()
    }

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }

        //setOpen(false);
      };

    const cardStyles: React.CSSProperties = {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    }

    const cardMediaStyles: React.CSSProperties = {
        height: 140
    }

    const cardContentStyles: React.CSSProperties = {
        //backgroundColor : 'blue'
    }
    const divStyles: React.CSSProperties = {
        flexGrow: 1
    }
    const cardActionStyles: React.CSSProperties = {
        display: 'inline-block',
        bottom: '0px',
        textAlign: 'right'
        //backgroundColor : 'red'
    }

    return (
        <>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card style={cardStyles} onClick={handleOnClick}>
                    <CardMedia component='img' image={props.product.image_url} alt={props.product.title} style={cardMediaStyles}></CardMedia>
                    <CardContent style={cardContentStyles}>
                        <Typography variant='h5'>{props.product.title}</Typography>
                        <Typography variant="body2">{props.product.description}</Typography>
                    </CardContent>
                    <div style={divStyles} />
                </Card>
            </Grid>
        </>
    )
}

export default ProductCard;