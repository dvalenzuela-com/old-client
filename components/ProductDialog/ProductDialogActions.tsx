import ProductDialogButton from "@Components/ProductDialog/ProductDialogButton";
import { ABProduct, ABProductOptionSelections } from "@Alabarra/alabarra-types";
import { Button } from "@mui/material";
import { ProductDialogMode } from "./ProductDialogMode";

type ProductDialogActionsProps = {
    mode: ProductDialogMode;
    product: ABProduct;
    selectedOptions: ABProductOptionSelections[];
    quantity: number;
    
    mainButtonDisabled?: boolean;
    onQuantityIncrease: () => void;
    onQuantityDecrease: () => void;
    onMainButtonPress: () => void;

}

const ProductDialogActions = (props: ProductDialogActionsProps) => {

    return (
        <>
            <Button onClick={props.onQuantityDecrease}>-</Button>
            {props.quantity}
            <Button onClick={props.onQuantityIncrease}>+</Button>

            <Button onClick={props.onMainButtonPress} disabled={props.mainButtonDisabled}>
                <ProductDialogButton
                    mode={props.mode}
                    product={props.product}
                    selectedOptions={props.selectedOptions}
                    selectedQuantity={props.quantity}
                />
            </Button>
        </>
    );
}

export default ProductDialogActions;