import { blue, green, red } from "@mui/material/colors";
import i18n from 'i18next';


interface SITE_CONFIG_TYPE {
    TITLE: string;
    PRIMARY_COLOR: any;
    BASE_COUNTRY: string;
    CURRENCY: string;
}

export const VALID_BUSINESS_IDS = [
    "g056ukCpnMDv2hej3tlP",
    "yvXbuPCwC1kwkd5h05qK",
    "i3kMMubfVD7t0Xykl3HV"
]

// TODO: Turn this into a react hook

export const GET_SITE_CONFIG = (businessId: string): SITE_CONFIG_TYPE => {

    if (businessId == "g056ukCpnMDv2hej3tlP") {
        if(i18n.language != "en") {
            i18n.changeLanguage("en");
        }
        return {
            TITLE: "Eisdiele Sonnenschein",
            PRIMARY_COLOR: green,
            BASE_COUNTRY: "DE",
            CURRENCY: "eur",
        }
    } else if (businessId == "yvXbuPCwC1kwkd5h05qK") {
        if(i18n.language != "es") {
            i18n.changeLanguage("es");
        }
        return {
            TITLE: "Pizzeria Cattus",
            BASE_COUNTRY: "DE", // Stripe does not support CL 🥲
            PRIMARY_COLOR: red,
            CURRENCY: "clp",
        }
    } else if (businessId == "i3kMMubfVD7t0Xykl3HV") {
        if(i18n.language != "es") {
            i18n.changeLanguage("es");
        }
        return {
            TITLE: "Burger King",
            BASE_COUNTRY: "DE", // Stripe does not support CL 🥲
            PRIMARY_COLOR: red,
            CURRENCY: "clp",
        }
    } else {
        if(i18n.language != "es") {
            i18n.changeLanguage("es");
        }
        return {
            TITLE: "Alabarra.com",
            BASE_COUNTRY: "DE",
            PRIMARY_COLOR: blue,
            CURRENCY: "clp",
        }
    }
};
