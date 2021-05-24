import { useState, useEffect } from "react"
import { isFullscreen } from "../utils";

export default function useIsFullscreen() {

    const initialValue = isFullscreen();

    const [value, setValue] = useState(initialValue);

    function handler() {
        setValue(isFullscreen());
    }

    useEffect(() => {
        document.addEventListener('fullscreenchange', handler)

        return () => {
            document.removeEventListener('fullscreenchange', handler)
        }
    }, [])


    return value;
}