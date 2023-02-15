import { ABProductTag } from "@dvalenzuela-com/alabarra-types";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import { CSSProperties } from "@mui/styled-engine";
import Image from "next/image";
import CurrencyText from "../CurrencyText/CurrencyText";
import ProductCardTag from "./ProductCardTag";

type ProductCardProps = {
    title: string;
    description: string;
    price: number;
    image_url: string;
    tags: ABProductTag[];
    onClick: () => void
}

const TwoLineWrap: CSSProperties = {
    whiteSpace: "initial",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: '2',
    WebkitBoxOrient: "vertical",
}

const ProductCard = (props: ProductCardProps) => {
    const { title, description, price, image_url, tags, onClick } = props;

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper onClick={onClick}>
                <Stack direction='row' spacing={0} alignItems='stretch' justifyContent='space-between'>
                    <Grid container>
                        <Grid item xs={8} sx={{pl: 1, pt: 1, pb: 1}}>
                            <Stack direction='column' alignContent='stretch' justifyContent='space-around' spacing={0}>
                                <Typography sx={{ fontWeight: 'bold' }}>{title}</Typography>
                                <Typography variant="body2" sx={TwoLineWrap}>{description}</Typography>
                                <Stack direction='row' spacing={2} alignItems='center' justifyContent='flex-start'>
                                    {tags.map(tag => <ProductCardTag value={tag} key={tag} />)}
                                </Stack>
                                <Typography variant="body1"><CurrencyText value={price} /></Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={4}>
                            {/** //TODO: Vertically-center image  */}
                            <div style={{ display: 'flex', justifyContent: 'right', alignItems:'center', verticalAlign: 'middle'}}>
                                <Image src={image_url} height={'100%'} width={'100%'} objectFit="contain" alt={title} />
                                
                            </div>
                        </Grid>
                    </Grid>
                </Stack>
            </Paper>
        </Grid>
    )
}

export default ProductCard;
