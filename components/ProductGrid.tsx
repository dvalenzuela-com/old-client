import { Grid } from "@mui/material";
import { ABCategory, ABProduct } from "@dvalenzuela-com/alabarra-types";
import { CSSProperties, useState } from "react";
import ProductCard from "./ProductCard";
import ProductDialog, { ProductDialogMode } from "./ProductDialog";
import CategoryHeader from "./CategoryHeader";

const tempDivStyle: CSSProperties = {
    backgroundColor: 'lightGray',
    width: '100%',
    height: '50px'
}

type ProductGridProps = {
    categories: ABCategory[];
    products: ABProduct[];
}

const ProductGrid = (props: ProductGridProps) => {

    const [activeProduct, setActiveProduct] = useState<ABProduct | undefined> (undefined);

    const handleProductClick = (product: ABProduct) => {
        setActiveProduct(product)
    }
    return (
        <>
            <Grid container spacing={5} direction='row' justifyContent='flex-start' alignItems='stretch' marginTop={1}>
                {props.categories.map(category => {
                    const toReturn = [<CategoryHeader category={category} key={category.id} />];
                    const productsInCategory = category.products.map(productId => {
                        return props.products.find((value) => {
                            if (value.path == productId) {
                                return value;
                            }
                        });
                    });
                    // TODO: Rank-order products
                    //productsInCategory.sort((a, b) => a.rank > b.rank);
                    productsInCategory.forEach(product => {
                        if (product) {
                            toReturn.push(<ProductCard key={product.id} product={product} onClick={() => {handleProductClick(product)}} />);
                        }
                    });
                    return toReturn;
                })}
            </Grid>
            {activeProduct && <ProductDialog mode={ProductDialogMode.NewLine} product={activeProduct} quantity={1} comment={null} onClose={() => {setActiveProduct(undefined)}} />}
        </>
    )
}

export default ProductGrid;