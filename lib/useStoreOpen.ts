import { ABBusinessConfig, ABFunctionDateWithinOpeningHours } from "@dvalenzuela-com/alabarra-types";
import { useEffect, useState } from "react";
import { useInterval } from "react-timers-hooks";

//FIX: Change this so that the interval is called once regarless of how many calls it gets. Maybe a provider?
export const useStoreOpen = (businessConfig: ABBusinessConfig) => {

    const [storeOpen, setStoreOpen] = useState<boolean>(false);

    const updateStoreOpenIfNeeded = () => {
        const nowStoreOpen = ABFunctionDateWithinOpeningHours(new Date(), businessConfig.week_opening_hours);
        if (storeOpen != nowStoreOpen) {
            setStoreOpen(nowStoreOpen);
        }
    }

    useEffect(updateStoreOpenIfNeeded, [businessConfig, storeOpen]);
    useInterval(updateStoreOpenIfNeeded, 60 * 1000);

    return storeOpen;
}
