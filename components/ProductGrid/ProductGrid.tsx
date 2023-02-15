import { Grid } from "@mui/material";
import { ABCategory, ABProduct } from "@dvalenzuela-com/alabarra-types";
import { useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import ProductDialog from "../ProductDialog/ProductDialog";
import CategoryHeader from "../CategoryHeader";
import { ProductDialogMode } from "../ProductDialog/ProductDialogMode";

type ProductGridProps = {
    categories: ABCategory[];
    products: ABProduct[];
}

const ProductGrid = (props: ProductGridProps) => {
    const { categories, products } = props;

    const [activeProduct, setActiveProduct] = useState<ABProduct | undefined> (undefined);

    const handleProductClick = (product: ABProduct) => {
        setActiveProduct(product)
    }

    return (
        <>
            <Grid container spacing={2} direction='row' justifyContent='flex-start' alignItems='stretch' marginTop={1}>
                {categories.map(category => {
                    const toReturn = [<CategoryHeader category={category} key={category.id} />];

                    productsInCategory(category, products).forEach(product => {
                        if (product) {
                            toReturn.push(
                                <ProductCard
                                    key={product.id}
                                    {...product}
                                    onClick={() => { handleProductClick(product) }} />
                            );
                        }
                    });
                    return toReturn;
                })}
            </Grid>
            {activeProduct &&
                <ProductDialog
                mode={ProductDialogMode.NewLine}
                product={activeProduct}
                quantity={1}
                comment={null}
                onClose={() => {setActiveProduct(undefined)}} />}
        </>
    )
}

export default ProductGrid;

function productsInCategory(category: ABCategory, products: ABProduct[]): ABProduct[] {
    return products.filter(prod => category.products.includes(prod.path));
}
