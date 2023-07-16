import { useLayoutEffect, useState } from "react";
import { useZxing } from "react-zxing";
import clsx from "clsx";
import {
  RiLightbulbLine,
  RiLightbulbFlashLine,
  RiCloseCircleLine,
  RiCameraFill,
  RiQrCodeLine,
} from './Icons';

const QrCodeScanner = ({ 
  onQrCodeScanned,
  disabled = false
}) => {
  // Note: paused ~= !visible.
  const [paused, setPaused] = useState(true);
  const onQrResult = (result) => {
    onQrCodeScanned ? onQrCodeScanned(result.getText()) : null;
    setPaused(true);
  };
  return (
    <div className={clsx('mx-auto flex flex-col', {'mt-4' : paused }, { "mt-8": !paused })}>
      {paused ? 
        <button 
          disabled={disabled}
          aria-pressed={!paused}
          id="use-scan-qr-code-button"
          className={clsx("stylish-button", "bg-e8-meteorite dark:bg-e8-picton-blue flex flex-nowrap items-center disabled:opacity-30" )}
          onClick={() => setPaused(false)}
            >
            <RiQrCodeLine className="h-10 w-10" aria-hidden="true"/>
            <span className="ml-2">scan qr code</span>
        </button>
        :
        <QrScanner 
          paused={paused}
          close={() => setPaused(true)}
          onQrResult={onQrResult}
          />}
    </div>
  )
};

// TBD, doesn't catch when permission is failed to be granted. 
// Either patch dependency, PR or rewrite from scratch.
const QrScanner = ({
  paused,
  close,
  onQrResult
}) => {
  /* To show the camera icon while the qr scanner and video stream loads. */
  const [ready, setReady] = useState(false);
  const {
    ref,
    torch: {
      on: torchOn,
      off: torchOff,
      isOn: isTorchOn,
      isAvailable: isTorchAvailable,
    },
  } = useZxing({
    paused,
    onResult: onQrResult,
    onError: (e) => onError(e)
  });
  const onError = (e) => {
    // FYI scanner constantly emits error "No Multiformat readers were able to detect the code." while scanning.
    // console.error(`got error ${e}`)
  };
  useLayoutEffect(() => {
    const loadedListener = (e) => setReady(true);
    let rc;
    if (ref.current) {
      rc = ref.current;
      rc.addEventListener('loadeddata', loadedListener);
    };
    return () => rc.removeEventListener('loadeddata', loadedListener);
  }, [ref, paused]);
  return (
    <div className="flex flex-col">
     <div className="relative mx-auto max-w-[300px]">
        {ready ?
          <QrScannerControls 
            isTorchOn={isTorchOn} 
            isTorchAvailable={isTorchAvailable} 
            torchOff={torchOff} 
            torchOn={torchOn} 
            close={close} 
          />
          :
          <div className="absolute top-0 w-full">
            <RiCameraFill className="inset-x-0 mx-auto mt-10 h-20 w-20 text-slate-600 opacity-50"/>
          </div> }
        <video ref={ref} />
      </div>
    </div>
  )
};

const QrScannerControls = ({ 
  isTorchAvailable = false,
  isTorchOn, 
  torchOff,
  torchOn,
  close 
}) => {
  return (
    <div className="absolute top-0 z-[60] mt-1 flex w-full text-[2em]">
      {isTorchAvailable ? 
        <button
          role="switch"
          aria-pressed={isTorchOn}
          aria-label="use device light"
          className={`${isTorchOn ? "text-slate-400" : "text-yellow-200"} z-50 p-2`}
          onClick={() => isTorchOn ? torchOff() : torchOn() }
          disabled={!isTorchAvailable} 
          >
            {isTorchOn 
              ? <RiLightbulbLine className="h-8 w-8" aria-hidden="true"/> 
              : <RiLightbulbFlashLine className="h-8 w-8" aria-hidden="true"/>
            } 
        </button> 
        : null
      }
      <div className="grow"></div>
      <button 
        aria-label="close"
        className="z-50 rounded-lg p-2 text-red-400 opacity-70"
        onClick={close}
        >
          <RiCloseCircleLine className="mr-1 h-8 w-8" aria-hidden="true"/>
      </button>
  </div>
  )
};

export default QrCodeScanner;