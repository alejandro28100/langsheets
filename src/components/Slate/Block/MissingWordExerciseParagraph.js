import React from 'react'

const MissingWordExerciseParagraph = (props) => {
    const { attributes, children } = props;
    return (
        <div {...attributes}>{children}</div>
    )
}

export default MissingWordExerciseParagraph
