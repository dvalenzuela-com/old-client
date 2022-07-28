import { AlabarraProduct } from "@dvalenzuela-com/alabarra-types";
import { useContext } from "react";
import NumberFormat from "react-number-format";
import { CartContext, ProductOptionSelection } from "../context/CartContext";
import { CurrencyNumberFormat } from "../lib/helper";
import { ProductDialogMode } from "./ProductDialog";


type ProductDialogButtonProps = {
    mode: ProductDialogMode;
    product: AlabarraProduct;
    selectedOptions: ProductOptionSelection[];
    selectedQuantity: number;
}
const ProductDialogButton = (props: ProductDialogButtonProps) => {

    const cart = useContext(CartContext);

    if (props.mode == ProductDialogMode.NewLine) {
        return (
            <>
                Add (<NumberFormat 
                    value={cart.calculateTotalPrice(props.product, props.selectedOptions, props.selectedQuantity)}
                    displayType='text'
                    {...CurrencyNumberFormat}/>)
            </>
        );
    } else if (props.mode == ProductDialogMode.EditLine && props.selectedQuantity == 0) {
        return (<>Remove</>);
    } else if (props.mode == ProductDialogMode.EditLine && props.selectedQuantity > 0) {
        return (
            <>
                Update (<NumberFormat 
                value={cart.calculateTotalPrice(props.product, props.selectedOptions, props.selectedQuantity)}
                displayType='text'
                {...CurrencyNumberFormat}/>)
            </>
        );
    } else {
        return <></>
    }
    
}

export default ProductDialogButton;
