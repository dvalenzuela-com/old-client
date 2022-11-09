import { ABProduct } from "@dvalenzuela-com/alabarra-types";
import { useContext } from "react";
import NumberFormat from "react-number-format";
import { CartContext, ProductOptionSelection } from "@Context/CartContext";
import { ProductDialogMode } from "./ProductDialog";
import CurrencyText from "./CurrencyText";
import { BusinessConfigContext } from "@Context/BusinessConfigContext";


type ProductDialogButtonProps = {
    mode: ProductDialogMode;
    product: ABProduct;
    selectedOptions: ProductOptionSelection[];
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
