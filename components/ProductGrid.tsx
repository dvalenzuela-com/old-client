import { Grid } from "@mui/material";
import { AlabarraProduct } from "@dvalenzuela-com/alabarra-types";
import { CSSProperties, useState } from "react";
import ProductCard from "./ProductCard";
import ProductDialog, { ProductDialogMode } from "./ProductDialog";

const tempDivStyle: CSSProperties = {
    backgroundColor: 'lightGray',
    width: '100%',
    height: '50px'
}

type ProductGridProps = {
    products: AlabarraProduct[] | undefined
}

const ProductGrid = (props: ProductGridProps) => {
    const products = props.products

    const [activeProduct, setActiveProduct] = useState<AlabarraProduct | undefined> (undefined);

    const handleProductClick = (product: AlabarraProduct) => {
        setActiveProduct(product)
    }
    return (
        <>
            <Grid container spacing={5} direction='row' justifyContent='flex-start' alignItems='stretch'>
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