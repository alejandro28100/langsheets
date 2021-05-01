import { useEffect } from 'react'
import PropTypes from 'prop-types'

const useDocumentTitle = title => {
    useEffect(() => {
        document.title = title
    }, [title]);
}

useDocumentTitle.propTypes = {
    title: PropTypes.string.isRequired,
}

export default useDocumentTitle
