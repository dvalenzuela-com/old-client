import { BusinessConfigContext } from "@Context/BusinessConfigContext";
import { CartContext } from "@Context/CartContext";
import { Button, ButtonGroup } from "@mui/material";
import { DefaultComponentProps } from "@mui/material/OverridableComponent";
import { useContext, useState } from "react";


const TipSelection = (props: any) => {

    const cart = useContext(CartContext);
    const businessConfig = useContext(BusinessConfigContext);

    const handleSelectTip = (optionId: string) => {
        cart.setTipOption(optionId);
    }

    return (
            <ButtonGroup {...props}  sx={{mt: 2}} fullWidth>
                {businessConfig.tip_options.map(tipOption => {
                    return (
                        <Button
                            key={tipOption.id}
                            onClick={() => handleSelectTip(tipOption.id)}
                            variant={cart.getCurrentTipOption().id === tipOption.id ? 'contained' : 'outlined'}>
                                {tipOption.percentage}% Tip
                        </Button>
                    );
                })}
            </ButtonGroup>
    );
}

export default TipSelection;
