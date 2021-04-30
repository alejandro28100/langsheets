import { Text } from '@chakra-ui/layout'
import React from 'react'

function Heading({ element, children, attributes }) {
    const { textAlign } = element;
    const fontSize = element.type.split(" ")[1];
    return (
        <Text textAlign={textAlign} fontSize={fontSize} {...attributes}> {children}</Text>
    )
}

export default Heading

