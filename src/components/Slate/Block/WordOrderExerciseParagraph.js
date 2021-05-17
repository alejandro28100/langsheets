import React from 'react'

const WordOrderExerciseParagraph = (props) => {
    const { attributes, children } = props;
    return (
        <div {...attributes}>{children}</div>
    )
}

export default WordOrderExerciseParagraph
