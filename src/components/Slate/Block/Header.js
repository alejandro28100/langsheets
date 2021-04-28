import { Text } from '@chakra-ui/layout'
import React from 'react'


export const Title = (props) => {
    return (
        <Text fontSize="4xl" {...props.attributes}>
            {props.children}
        </Text>
    )
}

export const Subtitle = (props) => {
    return (
        <Text fontSize="3xl" {...props.attributes}>
            {props.children}
        </Text >
    )
}


