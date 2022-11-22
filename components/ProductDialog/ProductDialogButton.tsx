import { ABProduct, ABProductOptionSelections } from "@dvalenzuela-com/alabarra-types";
import { useContext } from "react";
import { CartContext } from "@Context/CartContext";
import CurrencyText from "../CurrencyText";
import { BusinessConfigContext } from "@Context/BusinessConfigContext";
import { ProductDialogMode } from "./ProductDialogMode";

type ProductDialogButtonProps = {
    mode: ProductDialogMode;
    product: ABProduct;
    selectedOptions: ABProductOptionSelections[];
    selectedQuantity: number;
}

const ProductDialogButton = (props: ProductDialogButtonProps) => {

    const cart = useContext(CartContext);
    const businessConfig = useContext(BusinessConfigContext);

    if (props.mode == ProductDialogMode.NewLine) {
        return (
            <>
                Add (<CurrencyText value={cart.calculateTotalPrice(props.product, props.selectedOptions, props.selectedQuantity)} businessConfig={businessConfig} />)
            </>
        );
    } else if (props.mode == ProductDialogMode.EditLine && props.selectedQuantity == 0) {
        return (<>Remove</>);
    } else if (props.mode == ProductDialogMode.EditLine && props.selectedQuantity > 0) {
        return (
            <>
                Update (<CurrencyText value={cart.calculateTotalPrice(props.product, props.selectedOptions, props.selectedQuantity)} businessConfig={businessConfig} />)
            </>
        );
    } else {
        return <></>
    }
    
}

export default ProductDialogButton;
