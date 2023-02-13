import { NumericFormat } from "react-number-format";
import { ABBusinessConfig, ABBusinessConfigCurrency } from "@dvalenzuela-com/alabarra-types";
import { useBusinessConfig } from "@Context/BusinessConfigContext";

type CurrencyTextProps = {
    value: number;
    businessConfig?: ABBusinessConfig; // TODO: Remove this
}
const CurrencyText = ({value, businessConfig}: CurrencyTextProps) => {

    const business_context = businessConfig ?? useBusinessConfig();

    console.log("business_context", business_context);
    let thousandSeparator: string;
    let decimalSeparator: string;
    let prefix: string | undefined;
    let sufix: string | undefined;

    switch (business_context.currency) {
        case ABBusinessConfigCurrency.CLP:
            thousandSeparator = ".";
            decimalSeparator = ",";
            prefix = "$";
            sufix = undefined;
        break;

        case ABBusinessConfigCurrency.EUR:
            thousandSeparator = ".";
            decimalSeparator = ",";
            prefix = undefined;
            sufix = "€";
        break;

        case ABBusinessConfigCurrency.USD:
            thousandSeparator = ",";
            decimalSeparator = ".";
            prefix = "$";
            sufix = undefined;
        break;

        case ABBusinessConfigCurrency.GBP:
            thousandSeparator = ",";
            decimalSeparator = ".";
            prefix = "£";
            sufix = undefined;
        break;

        default:
            thousandSeparator = "ERROR";
            decimalSeparator = "ERROR_";
            prefix = "ERROR";
            sufix = undefined;
        break;
    }
    
    return <NumericFormat
        value={value}
        displayType='text'
        decimalSeparator={decimalSeparator}
        thousandSeparator={thousandSeparator}
        prefix={prefix}
        suffix={sufix}
    />;
}

export default CurrencyText;