import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
//import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  //.use(LanguageDetector)

  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          Layout: {
            PoweredBy: 'Powered by',
            Impressum: 'Impressum',
            Legals: 'Legals',
          },
          CartContent: {
            TableHeader: {
              Count: 'Count',
              Product: 'Product',
              Price: 'Price',
            },
            TableRow: {
              Comment: 'Comment: ',
              Edit: 'edit',
            },
            TableFooter: {
              Total: 'TOTAL',
            },
          },
          ProductCard: {
            CommentPlaceholder: 'Any comments for this order?',
            AddToCart: 'Add',
          },
          ProductDialog: {
            Snackbar: {
              ProductRemoved: 'Product removed from the cart',
              OrderLineUpdated: 'Order line updated',
            },
          },
          StripeButton: {
            Order: {
              Label: 'Alabarra order',
            },
            NotAvailable: 'No digital payment available',
          },
          Navbar: {
            Tooltip: {
              Title: 'Checkout',
            },
          },
          Cart: {
            Title: 'Checkout',
            Snackbar: {
              ManualOrderPlaced:
                'Your order has been placed. A waiter will collect payment from you shortly.',
              DigitalOrderPlaced:
                "Your order has been placed and paid. We'll bring it as soon as possible!",
              OrderError: 'Error with your order. Please try again.',
            },
            CartEmpty: {
              Title: 'No products in the cart',
            },
            OrderSummary: {
              Title: 'Order summary',
            },
            SelectTable: {
              Title: 'Select your table',
              Placeholder: 'Select your table',
            },
            Username: {
              Title: 'Your name',
              Placeholder: 'How should we call you at the table?',
            },
            GeneralNote: {
              Title: 'General note',
              Placeholder: 'Any comments for your order?',
            },
            PaymentMethod: {
              Title: 'Select your payment method',
              Presential: {
                Title: 'Presential payment:',
                Subtitle: 'A waiter will come to your table to collect payment',
              },
              Digital: {
                Title: 'Digital payment:',
                Subtitle: 'Pay from the comfort of your phone and get your order sooner',
              },
            },
            Order: {
              Title: 'Order',
              PresentialPaymentButton: 'Order now!',
            },
          },
        },
      },
      es: {
        translation: {
          Layout: {
            PoweredBy: 'Powered by',
            Impressum: 'Impressum',
            Legals: 'Legals',
          },
          CartContent: {
            TableHeader: {
              Count: 'Cantidad',
              Product: 'Producto',
              Price: 'Precio',
            },
            TableRow: {
              Comment: 'Commentario: ',
              Edit: 'editar',
            },
            TableFooter: {
              Total: 'TOTAL',
            },
          },
          ProductCard: {
            CommentPlaceholder: '¿Algún comentario para esta orden?',
            AddToCart: 'Agregar',
          },
          ProductDialog: {
            Snackbar: {
              ProductRemoved: 'Producto quitado del carrito',
              OrderLineUpdated: 'Linea de pedido actualizada',
            },
          },
          StripeButton: {
            Order: {
              Label: 'Orden Alabarra ctm 💪',
            },
            NotAvailable: 'Pagos digitales no disponibles',
          },
          Navbar: {
            Tooltip: {
              Title: 'Checkout',
            },
          },
          Cart: {
            Title: 'Checkout',
            Snackbar: {
              ManualOrderPlaced:
                'Tu orden ha sido enviada. Un mesero irá a tu mesa a cobrar el pedido en breve.',
              DigitalOrderPlaced:
                'Tu orden ha sido pagada y enviada. ¡Te la llevaremos lo antes posible!',
              OrderError: 'Error con la orden. Por favor intenta nuevamente.',
            },
            CartEmpty: {
              Title: 'No hay productos en el carrito',
            },
            OrderSummary: {
              Title: 'Resumen de la orden',
            },
            SelectTable: {
              Title: 'Elije tu mesa',
              Placeholder: 'Elije tu mesa',
            },
            Username: {
              Title: 'Tu nombre',
              Placeholder: '¿Como te identificamos en la mesa?',
            },
            GeneralNote: {
              Title: 'Nota general',
              Placeholder: '¿Algún comentario para esta orden?',
            },
            PaymentMethod: {
              Title: 'Selecciona tu modo de pago',
              Presential: {
                Title: 'Pago presencial: ',
                Subtitle: 'Un mesero irá a tu mesa a cobrar',
              },
              Digital: {
                Title: 'Pago digital: ',
                Subtitle: '¡Paga desde la comodidad de tu celular y recibe tu orden antes!',
              },
            },
            Order: {
              Title: 'Orden',
              PresentialPaymentButton: 'Pedir ahora!',
            },
          },
        },
      },
    },
  });

export default i18n;
