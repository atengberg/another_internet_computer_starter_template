import ToolTip from '../components/ToolTip';
import NimbusPlanet from '~icons/nimbus/planet'

const Landing = () => {
  return (
    <div className="w-full h-full">
      <div className="fixed top-[40%] left-[35%] w-[30%] h-[30%] z-10">
        <div className="relative group w-full h-full">
          <ToolTip
            text={`"--the circle points most clearly to the fourth dimension.” -W.K.`}
            textStyles='text-2xl whitespace-nowrap tracking-widest sm:text-sm md:text-md lg:text-xl'
            toolTipPlacement="top-[50%] left-[-65%] md:left-[-35%] lg:left-[-40%] xl:left-[-25%] 2xl:left-[-15%]"
            />
        </div>
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center overflow-hidde z-90">
        <NimbusPlanet className="w-full h-full p-16 rotate -mt-24"/>
      </div>
    </div>
  )
};

export default Landing;