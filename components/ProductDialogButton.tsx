import { AlabarraProduct } from "alabarra-types";
import { useContext } from "react";
import NumberFormat from "react-number-format";
import { CartContext, ProductOptionSelection } from "../context/CartContext";
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
                    {...process.env.CurrencyNumberFormat}/>)
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
                {...process.env.CurrencyNumberFormat}/>)
            </>
        );
    } else {
        return <></>
    }
    
}

export default ProductDialogButton;
