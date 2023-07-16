import { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Fa6SolidPersonThroughWindow from '~icons/fa6-solid/person-through-window'


const useMixBlendMode = () => {

  const [type, setType] = useState("e")
  const [i, setI] = useState(0);
  const [mode, setMode] = useState("mix-blend-normal");
  return useMemo(() => { 
    const modes = [
      "mix-blend-normal",
      "mix-blend-multiply",
      "mix-blend-screen",
      "mix-blend-overlay",
      "mix-blend-darken",
      "mix-blend-lighten",
      "mix-blend-color-dodge",
      "mix-blend-color-burn",
      "mix-blend-hard-light",
      "mix-blend-difference",
      "mix-blend-exclusion",
      "mix-blend-hue",
      "mix-blend-saturation",
      "mix-blend-color",
      "mix-blend-luminosity",
      "mix-blend-plus-lighter"
    ];
    const bgModes = modes.map(m => `bg-${m}`);
    const toggleType = () => { setType((type === 'e') ? 'bg' : 'e') }
    const nextI = () => (i === modes.length - 1) ? 0 : (i + 1);
    const iterateMode = () => {
      setI(nextI());
      setMode( (type === 'e') ? modes[i] : bgModes[i])
    }
    const random = () => Math.floor(Math.random() * modes.length);
    return {
    toggleBlendModeType: toggleType,
    nextBlendMode: iterateMode,
    currentBlendMode: mode,
    getRandomMode: () => (type === 'e') ? modes[random()] : bgModes[random()]
  }}, [ i, type, mode]);
}

const MixBlendToggle = () => {
  const { toggleBlendModeType, nextBlendMode, currentBlendMode } = useMixBlendMode();
  return (
    <div className="flex flex-col justify-center items-center">
      <button className="border-2 border-zinc-500 bg-zinc-300 px-8 py-2" onClick={() => toggleBlendModeType()}>toggle blend mode type</button>
      <button className="border-2 border-zinc-500 bg-zinc-300 px-8 py-2" onClick={() => nextBlendMode()}>next blend mode</button>
      <span className="text-2xl px-4 tracking-wide">{currentBlendMode}</span>
    </div>
  )
};


export default useMixBlendMode;
export { MixBlendToggle }