import { useState, useMemo } from 'react';

const useUtilityIterator = (utilities = []) => {
  const [i, setI] = useState(0);
  const [current, setCurrent] = useState(utilities[i]);
  const iterate = () => {
    setI(() => (i === utilities.length - 1) ? 0 : (i + 1)); 
    setCurrent(() => utilities[i]);
  }
  return {
    current, iterate
  }
};

const UtilityIterator = ({ current, iterate }) => {
  return (
    <button className="px-2 py-1 rounded-xl bg-zinc-800/80 hover:-translate-y-1 active:scale-98" onClick={() => iterate()}>
      <span className="m-auto text-2xl text-white tracking-wide font">{current || "undefined"}</span>
    </button>
  )
};

const both = () => [
  useUtilityIterator,
  UtilityIterator
]


const fonts = [
  'satoshi',
  'spectral',
  'figtree',
  'dm-sans',
  'quicksand',
  'courier-prime',
  'manrope',
  'inconsolata'
].map(f => `font-${f}`);

export default useUtilityIterator;
export { fonts }
