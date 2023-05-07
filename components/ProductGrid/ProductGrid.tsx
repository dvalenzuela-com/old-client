import { Grid } from "@mui/material";
import { ABCategory, ABProduct } from "@Alabarra/alabarra-types";
import { RefObject, useEffect, useRef, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import ProductDialog from "../ProductDialog/ProductDialog";
import CategoryHeader from "../CategoryHeader";
import { ProductDialogMode } from "../ProductDialog/ProductDialogMode";
import CategorySwiper, { CategorySwiperRef } from "@Components/CategorySwiper/CategorySwiper";
import React from "react";

type ProductGridProps = {
    categories: ABCategory[];
    products: ABProduct[];
}

// TODO: This depends on our theme and Category Swiper, read values dynamically from there
const TOP_OFFSET = 148;//64 + 44;

const ProductGrid = (props: ProductGridProps) => {
    const { categories, products } = props;

    const [activeProduct, setActiveProduct] = useState<ABProduct | undefined> (undefined);

    const gridRef = useRef<HTMLDivElement>(null);
    const categorySwiperRef = useRef<CategorySwiperRef>(null);

    const categoryHeaderRefs = categories.reduce((acc: { [key: string]: RefObject<HTMLDivElement> }, value) => {
        acc[value.id] = React.createRef();
        return acc;
    }, {});

    //const [ignoreCallback, setIgnoreCallback] = useState(false);
    
    useEffect(() => {
        const findCatHeaderByElement = (element: Element) => {
            return Object.entries(categoryHeaderRefs).find(([id, ref]) => element == ref.current);
        }
    
    
        const observer = new IntersectionObserver((entries) => {

            const allFullyVisible = entries.filter(entry => entry.isIntersecting);
            if (allFullyVisible.length == 0) {
                return;
            }
            const firstVisible = allFullyVisible[0];
            const catHeader = findCatHeaderByElement(firstVisible.target);
            if (catHeader) {
                const foundCat = categories.find((cat) => cat.id === catHeader[0]);
                if (foundCat) {
                    const index = categories.indexOf(foundCat);
                    //console.log("ProductGrid: IntersectionObserver: foundCat:", foundCat.title);
                    // if (ignoreCallback) {
                    //     console.log("ProductGrid: IntersectionObserver: IGNORING CALLBACK");
                    //     return;
                    // }
                    categorySwiperRef.current?.swipeTo(foundCat.id);
                }
            }

            
        }, { threshold: 0, root: undefined, rootMargin: `${-TOP_OFFSET}px 0px -${window.innerHeight - TOP_OFFSET}px 0px` });

  
    
        if(categoryHeaderRefs) {
            
            Object.entries(categoryHeaderRefs).forEach(([id, ref]) => {
                if(ref.current) {
                    observer.observe(ref.current)
                }
            });
        }

        return () => {
            // Remove observer
            observer.disconnect();
        }
    }, [categories, categoryHeaderRefs]);

    const handleProductClick = (product: ABProduct) => {
        setActiveProduct(product)
    }

    const handleSwipeTo = (categoryId: string) => {

        //console.log(`ProductGrid: handleSwipeTo(${categoryId})`);

        //setIgnoreCallback(true);
        
        if(!categoryHeaderRefs[categoryId] || !categoryHeaderRefs[categoryId].current) {
            //console.log(`ProductGrid: handleSwipeTo(${categoryId}) NO CATEGORY FOUND`);
            return;
        }

        // FIXME: This is very dirty. We scroll the view into place (to the top of the view port) and then move it down the appropiate height
        categoryHeaderRefs[categoryId].current!.scrollIntoView({
            behavior: 'auto',
        });
        window.scrollBy({
            top: -104
        })

        // setTimeout(() => {
        //     setIgnoreCallback(false);
        // }, 0);
    }

    return (
        <>
            <CategorySwiper categories={categories} onSwipeTo={handleSwipeTo} ref={categorySwiperRef} />
            <Grid
                container
                spacing={2}
                direction='row'
                justifyContent='flex-start'
                alignItems='stretch'
                marginTop={1}
                pl={3}
                pr={3}
                pb={3}
                style={{overflowY: 'scroll'}}
                ref={gridRef}
            >
                {categories.map(category => {
                    const toReturn = [<CategoryHeader category={category} key={category.id} ref={categoryHeaderRefs[category.id]} />];

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
