import React from 'react'
import { Box } from '@chakra-ui/layout'
import { Editable } from "slate-react";

const CustomEditable = ({ decorate, renderElement, renderLeaf, readOnly, placeholder }) => (
    <Box
        background="white"
        p="5"
        as={Editable}
        {...{
            decorate,
            renderElement,
            renderLeaf,
            readOnly,
            placeholder,
        }}
    />
)

export default CustomEditable
