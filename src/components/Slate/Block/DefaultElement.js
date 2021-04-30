import { Text } from '@chakra-ui/layout';
import React from 'react'

const DefaultElement = ({ attributes, element, children }) => {
    const { textAlign } = element;
    return (
        <Text textAlign={textAlign} {...attributes}>
            {children}
        </Text>
    )

}

export default DefaultElement
