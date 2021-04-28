import React from 'react'
import PropTypes from "prop-types";
import { Flex, Spacer, Icon } from "@chakra-ui/react"
import { IoMdDocument } from "react-icons/io"

function Navbar({ leftActions, rightActions, withIcon }) {
    return (

        <Flex bgColor="blue.500" px="10" py="2">
            {withIcon && <Icon mx="2" color="white" w="2.5em" h="2.5em" as={IoMdDocument} title="Langsheets" />}
            {leftActions}
            <Spacer />
            {rightActions}
        </Flex>
    )
};

Navbar.defaultProps = {
    withIcon: true
}

Navbar.propTypes = {
    leftActions: PropTypes.node,
    rightActions: PropTypes.node,
}

export default Navbar
