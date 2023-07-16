


const fix = ({ name, vals}) => {
  return `.${name} { \n\t@apply ` + vals.reduce((acc, cur) => `${cur.replace(`'`, '')} ${acc}`, "").slice(0, -1) + "; \n}"
}

const vals = [
  'm-s:bg-pink-500',
  'm-m:bg-red-500',
  'm-l:bg-orange-500',
  'sm:bg-yellow-500',
  'md:bg-green-600',
  'lg:bg-blue-500 ',
  'xl:bg-violet-500',
  '2xl:bg-purple-800',
];



console.log(fix('color-sizing'))

/*

.landing-title { 
        @apply 
          text-2xl m-l:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl text-shadow-inset-xs 
          shadow-e8-g-text-primary dark:shadow-e8-g-text-secondary tracking-[.1rem] sm:tracking-[.125rem] 
          whitespace-nowrap font-medium themed-font-color; 
}


*/