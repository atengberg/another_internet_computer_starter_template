const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

const em = px => `${px / 16}em`;
const pxToRem = px => ({ [px]: `${px / 16}rem` });
const px = num => ({ [num]: `${num}px` });

export default {
  content: [
    "./tailwind.config.js",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: { 
    // Mobile responsiveness is not out of the box, as the smallest default screen 
    // is twice the average width of a typical mobile (cellular) device's viewport:
    screens: {
      'm-s': '300px',
      'm-m': '361px',
      'm-l': '411px',
      'm-xl': '501px',
      ...defaultTheme.screens
    },
    // Positions and styles the overlay label showing current screen breakpoint:
    debugScreens: {
      position: ['bottom', 'left'],
      style: { fontSize: '1.5rem' }
    },
    fontFamilys: {
      'mono': ['Inconsolata', ...defaultTheme.fontFamily.mono]
    },
    // Default blur values increase too quickly:
    blur: { 
      '0': '0px',
      'none': '0px',
      'xs': '2px',
      sm: '3px',
      DEFAULT: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px',
      '2xl': '16px',
      '3xl': '24px',
      '4xl': '36px'
    },
    extend: {
      boxShadow: {
        'xc-light': `2px 0px 2px hsl(210, 100%, 100%, .2), -2px 0px 2px hsl(210, 100%, 100%, .2),  1px 0px 1px hsl(210, 100%, 100%, .1), -1px 0px 1px hsl(210, 100%, 100%, .1), inset 0px -2px 2px hsl(210, 100%, 100%, .2), inset 0px 1px 1px hsl(210, 100%, 100%, .1)`,
        'xc-dark': `2px 0px 2px hsl(210, 0%, 0%, .2),     -2px 0px 2px hsl(210, 0%, 0%, .2),      1px 0px 1px hsl(210, 0%, 0%, .1),     -1px 0px 1px hsl(210, 0%, 0%, .1),     inset 0px 2px 2px hsl(210, 0%, 0%, .2),      inset 0px -1px 1px hsl(210, 0%, 0%, .1)`,
        'form-field-light': `inset 0 -2px 3px hsl(210, 100%, 100%, .2), inset 0 -1px 1px hsl(210, 100%, 100%, .1)`,
        'form-field-dark': `inset 0 -2px 3px hsl(210, 0%, 0%, .2), inset 0 -1px 1px hsl(210, 0%, 0%, .1)`,
        'top': `inset 0 2px 2px var(--tw-shadow-color)`,
      },
      colors: {
        'e8-brand-infinite': '#3B00B9',          // rgb(59, 0, 185) 
        'e8-brand-dark-infinite': '#1E005D',     // rgb(30, 0, 93) 
        'e8-picton-blue': '#29ABE2',             // rgb(41, 171, 226)
        'e8-meteorite': '#522785',               // rgb(82, 39, 133)
        'e8-razzmatazz': '#ED1E79',              // rgb(237, 30, 121)
        'e8-flamingo': '#F15A24',                // rgb(241, 90, 36)
        'e8-sea-buckthorn': '#FBB03B',           // rgb(251, 176, 59)
        'e8-black': '#181818',                   // rgb(24, 24, 24)
        'e8-white': '#fff',                      // rgb(255, 255, 255)
        'e8-g-text-primary': '#6A85F1',
        'e8-g-text-secondary': '#C572EF',
        'u-snow': '#f9f9f9',                     // rgb(249, 249, 249)
        'u-green-success': 'rgba(16, 185, 129, 1)'
      },
      // TODO !!! IMPORTANT !!! Remember to remove unused fonts here!!!
      fontFamily: {
        'satoshi': ['Satoshi', 'sans-serif'],
        'spectral': ['Spectral', 'serif'],
        'figtree': ['Figtree', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
        'quicksand': ['Quicksand', 'sans-serif'],
        'courier-prime': ['Courier Prime', 'monospace'],
        'manrope': ['Manrope', 'sans-serif'],
        'inconsolata': ['Inconsolata', 'monospace']
      },
      gradientColorStops: {
        'light-primary': '#C0D9FF',
        'light-secondary': '#F0B9E5',
        'dark-primary': '#0E031F',
        'dark-secondary': '#281447',
        'text-primary': '#6A85F1',
        'text-secondary': '#C572EF'
      },
      backgroundImage: theme => ({
        'gradient-light': `linear-gradient(to right, ${theme('gradientColorStops.light-primary')}, ${theme('gradientColorStops.light-secondary')})`,
        'gradient-dark': `linear-gradient(to right, ${theme('gradientColorStops.dark-primary')}, ${theme('gradientColorStops.dark-secondary')})`,
        'gradient-text': `linear-gradient(to right, ${theme('gradientColorStops.text-primary')}, ${theme('gradientColorStops.text-seconadry')})`,
        'gradient-ac': `conic-gradient(rgba(59,0,185,1) 38%, rgba(30,0,93,1) 59%, rgba(41,171,226,1) 71%, rgba(82,39,133,1) 82%, rgba(237,30,121,1) 92%, rgba(251,176,59,1) 96%, rgba(241,90,36,1) 100%)`,
        'gradient-sb': `linear-gradient(180deg, #d0368a 0%, #708ad4 99%)`
      }),  
      textShadow: {
        'xs': '0px 1px 2px var(--tw-shadow-color)',
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        md: '0 4px 8px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
        'inset-sm': `0px -1px 2px var(--tw-shadow-color)`,
        'inset': `0px -2px 3px var(--tw-shadow-color), 0px -1px 1px var(--tw-shadow-color)`,
        'inset-lg': `0px -4px 6px var(--tw-shadow-color), -1px -2px 1px var(--tw-shadow-color)`
      },
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-debug-screens'),
    require("tailwind-gradient-mask-image"),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {'text-shadow': (value) => ({ textShadow: value }) },
        { values: theme('textShadow') }
      )
    }),
  ],
  variants: {
    fluidType: ['responsive'],
    extend: {
      textColor: ['dark'],
      dropShadow: ['hover', 'focus', 'dark'],
      textShadow: ['responsive', 'hover', 'focus', 'active', 'disabled'],
    }
  }
}


/*
doesn't work with custom screens
    require('tailwindcss-fluid-type')({
      settings: {
        fontSizeMin: 1, // 1.125rem === 18px
        fontSizeMax: 1.5, // 1.25rem === 20px
        ratioMin: 1.1, // Multiplicator Min
        ratioMax: 1.25, // Multiplicator Max
        screenMin: 18.75, // 300px
        screenMax: 96, // 96rem === 1536px
        unit: 'rem', // default is rem but it's also possible to use 'px'
        prefix: '', // set a prefix to use it alongside the default font sizes
        extendValues: false, 
      },
      values: {
        '4xs': [-3.5, 1.4],
        '3xs': [-3, 1.4],
        '2xs': [-2.5, 1.4],
        'xs': [-2, 1.6],
        'sm': [-1, 1.6],
        'md': [.8, 1.6],
        'lg': [1.2, 1.6],
        'xl': [2, 1.2],
        '2xl': [3, 1.2],
        '3xl': [4, 1.2],
        '4xl': [5, 1.1],
        '5xl': [6, 1.1],
        '6xl': [7, 1.1],
        '7xl': [8, 1],
        '8xl': [9, 1],
        '9xl': [10, 1],
        '10xl': [10.5, 1]
      },
    }),
*/


//https://anothertechs.com/programming/tailwindcss/tailwindcss-scrollbar/
//https://github.com/adoxography/tailwind-scrollbar
//#FAFCFF
// Color branding suggested "proportions of use" as a gradient:
// background: linear-gradient(rgba(59,0,185,1) 38%, rgba(30,0,93,1) 59%, rgba(41,171,226,1) 71%, rgba(82,39,133,1) 82%, rgba(237,30,121,1) 92%, rgba(251,176,59,1) 96%, rgba(241,90,36,1) 100%);
//https://github.com/juhanakristian/tailwind-gradient-mask-image gradient-mask-t-0
// text mask gradient clip -> text-3xl font-extrabold etc, then-> 'text-transparent bg-clip-text <gradient>' OR as a header class <grad > inline-block text-transparent bg-clip-text

// gradient underline: https://javascript.plainenglish.io/create-a-gradient-underline-with-tailwind-css-9abbb33bebcd
// says add a the part to underline as a span with 
// '<gradient> <bg-[length:100%_5px] bg-no-repeat bg-bottom' to do the underline, 
// bg-[length:100% (width):_5px (height)]     | bg-no-repeat so it doesn't keep and bg-bottom to position it

/*

     require("tailwind-heropatterns")({
      // as per tailwind docs you can pass variants
      variants: [],
    
      // the list of patterns you want to generate a class for
      // the names must be in kebab-case
      // an empty array will generate all 87 patterns
      patterns: ["slanted-stars", "signal"],
    
      // The foreground colors of the pattern
      colors: {
        default: "#000",
        "black": "#000",
        "test": "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 50%, rgba(0,212,255,1) 100%)"
      },
    
      // The foreground opacity
      opacity: {
        default: ".4",
        "100": "1.0"
      }
    }),
    */