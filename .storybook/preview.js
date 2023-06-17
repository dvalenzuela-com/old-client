import { BusinessConfigContext } from './../context/BusinessConfigContext';
import {
  ABBusinessConfig,
  ABBusinessConfigCountry,
  ABBusinessConfigCurrency,
} from '@Alabarra/alabarra-types';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    defaultViewport: 'mobile1',
  },
};

const dummyBusinessConfig = {
  id: 'dummy',
  business_name: 'dummy',
  country: ABBusinessConfigCountry.CL,
  main_language: 'dummy',
  currency: ABBusinessConfigCurrency.CLP,
  logo_url: 'dummy',
  palette: undefined,
  tip_options: [],
  week_opening_hours: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  },
};

export const decorators = [
  (Story) => (
    <BusinessConfigContext.Provider value={dummyBusinessConfig}>
      <Story />
    </BusinessConfigContext.Provider>
  ),
];
