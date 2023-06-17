import { ABProduct, ABProductOptionSelections } from '@Alabarra/alabarra-types';
import { useCart } from '@Context/CartContext';
import CurrencyText from '../CurrencyText/CurrencyText';
import { useBusinessConfig } from '@Context/BusinessConfigContext';
import { ProductDialogMode } from './ProductDialogMode';

type ProductDialogButtonProps = {
  mode: ProductDialogMode;
  product: ABProduct;
  selectedOptions: ABProductOptionSelections[];
  selectedQuantity: number;
};

const ProductDialogButton = (props: ProductDialogButtonProps) => {
  const cart = useCart();
  const businessConfig = useBusinessConfig();

  if (props.mode == ProductDialogMode.NewLine) {
    return (
      <>
        Add (
        <CurrencyText
          value={cart.calculateProductPrice(
            props.product,
            props.selectedOptions,
            props.selectedQuantity
          )}
          businessConfig={businessConfig}
        />
        )
      </>
    );
  } else if (props.mode == ProductDialogMode.EditLine && props.selectedQuantity == 0) {
    return <>Remove</>;
  } else if (props.mode == ProductDialogMode.EditLine && props.selectedQuantity > 0) {
    return (
      <>
        Update (
        <CurrencyText
          value={cart.calculateProductPrice(
            props.product,
            props.selectedOptions,
            props.selectedQuantity
          )}
          businessConfig={businessConfig}
        />
        )
      </>
    );
  } else {
    return <></>;
  }
};

export default ProductDialogButton;
