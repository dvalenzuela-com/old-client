import { Grid } from "@mui/material";
import { ABProduct } from "@dvalenzuela-com/alabarra-types";
import { CSSProperties, useState } from "react";
import ProductCard from "./ProductCard";
import ProductDialog, { ProductDialogMode } from "./ProductDialog";

const tempDivStyle: CSSProperties = {
    backgroundColor: 'lightGray',
    width: '100%',
    height: '50px'
}

type ProductGridProps = {
    products: ABProduct[] | undefined
}

const ProductGrid = (props: ProductGridProps) => {
    const products = props.products

    const [activeProduct, setActiveProduct] = useState<ABProduct | undefined> (undefined);

    const handleProductClick = (product: ABProduct) => {
        setActiveProduct(product)
    }
    return (
        <>
            <Grid container spacing={5} direction='row' justifyContent='flex-start' alignItems='stretch' marginTop={1}>
                {products && products.map((product) => {
                    return (
                        <ProductCard key={product.id} product={product} onClick={() => {handleProductClick(product)}} />
                    )
                })}
            </Grid>
            {activeProduct && <ProductDialog mode={ProductDialogMode.NewLine} product={activeProduct} quantity={1} comment={null} onClose={() => {setActiveProduct(undefined)}} />}
        </>
    )
}

export default ProductGrid;