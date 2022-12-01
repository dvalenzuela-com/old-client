import { ABBusinessConfig, ABBusinessConfigCountry, ABBusinessConfigCurrency } from "@dvalenzuela-com/alabarra-types";
import { createContext, useContext } from "react";

export const useBusinessConfig = () => useContext(BusinessConfigContext);

export const BusinessConfigContext = createContext<ABBusinessConfig>({
    id: "dummy",
    business_name: "dummy",
    country: ABBusinessConfigCountry.CL,
    main_language: "dummy",
    currency: ABBusinessConfigCurrency.EUR,
    logo_url: "dummy",
    palette: undefined,
    tip_options: [],
    week_opening_hours: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
    }
});