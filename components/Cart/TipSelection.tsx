import { useBusinessConfig } from '@Context/BusinessConfigContext';
import { useCart } from '@Context/CartContext';
import { Button, ButtonGroup } from '@mui/material';

const TipSelection = (props: any) => {
  const cart = useCart();
  const businessConfig = useBusinessConfig();

  const handleSelectTip = (optionId: string) => {
    cart.setTipOption(optionId);
  };

  return (
    <ButtonGroup {...props} sx={{ mt: 2 }} fullWidth>
      {businessConfig.tip_options
        .sort((a, b) => (a.percentage > b.percentage ? 1 : -1))
        .map((tipOption) => {
          return (
            <Button
              key={tipOption.id}
              onClick={() => handleSelectTip(tipOption.id)}
              variant={tipOption.id == cart.selectedTipOptionId ? 'contained' : 'outlined'}
            >
              {tipOption.percentage}% Tip
            </Button>
          );
        })}
    </ButtonGroup>
  );
};

export default TipSelection;
