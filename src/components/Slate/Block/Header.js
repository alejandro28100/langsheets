import React from 'react'

export const Title = (props) => {
    return (
        <h2 {...props.attributes}>
            {props.children}
        </h2>
    )
}

export const Subtitle = (props) => {
    return (
        <h3 {...props.attributes}>
            {props.children}
        </h3>
    )
}


