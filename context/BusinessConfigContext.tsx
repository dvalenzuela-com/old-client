import { ABBusinessConfig, ABBusinessConfigCountry, ABBusinessConfigCurrency } from "@dvalenzuela-com/alabarra-types";
import { createContext } from "react";

export const BusinessConfigContext = createContext<ABBusinessConfig>({
    id: "dummy",
    business_name: "dummy",
    country: ABBusinessConfigCountry.CL,
    main_language: "dummy",
    currency: ABBusinessConfigCurrency.EUR,
    primary_color: "dummy",
    logo_url: "dummy",
    colors: undefined
});