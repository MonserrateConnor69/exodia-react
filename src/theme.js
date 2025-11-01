import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    900: '#0D1B2A',
    800: '#1B263B',
    700: '#415A77',
    200: '#E0E1DD',
    100: '#A2FF86',
    50: '#77B6EA',
  },
};

const fonts = {
  heading: `'Montserrat', sans-serif`,
  body: `'Roboto', sans-serif`,
};

const components = {
  Modal: {
    baseStyle: {
      dialog: {
        bg: 'brand.800',
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.4)',
        border: '1px solid',
        borderColor: 'brand.700',
        color: 'brand.200', // <-- THE FIX IS HERE
      }
    }
  },
  Button: {
    variants: {
      solid: (props) => ({
        bg: props.colorScheme === 'purple' ? 'brand.50' : props.colorScheme === 'teal' ? 'brand.100' : undefined,
        color: (props.colorScheme === 'purple' || props.colorScheme === 'teal') ? 'brand.900' : undefined,
        _hover: {
          bg: (props.colorScheme === 'purple' || props.colorScheme === 'teal') ? 'white' : undefined,
        }
      }),
      outline: {
        borderColor: 'brand.100',
        color: 'brand.100',
        _hover: {
          bg: 'rgba(162, 255, 134, 0.1)',
        },
      },
    },
  },
};

export const theme = extendTheme({ colors, fonts, components });