import { useEffect } from 'react'
import PropTypes from 'prop-types'

const useBodyBackground = (backgroundColor) => {
    //Set the color value to the body background on mount 

    useEffect(() => {
        document.body.style.background = backgroundColor;
    }, []);
}


const setBodyBackground = (backgroundColor) => {
    document.body.style.background = backgroundColor;
}







useBodyBackground.propTypes = {
    backgroundColor: PropTypes.string.isRequired,
}

export default useBodyBackground
