import { ABBusinessConfig, ABFunctionDateWithinOpeningHours } from "@dvalenzuela-com/alabarra-types";

export const isStoreOpen = (businessConfig: ABBusinessConfig) => {
    return ABFunctionDateWithinOpeningHours(new Date(), businessConfig.week_opening_hours);
}
