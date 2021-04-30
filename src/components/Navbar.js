import React from 'react'
import PropTypes from "prop-types";
import { Flex, Spacer, Icon, Text } from "@chakra-ui/react"
import { ReactComponent as Logo } from "../logo.svg";

function Navbar({ leftActions, rightActions, withIcon }) {
    return (
        <Flex px="10" background="white" py="2" shadow="sm">

            {withIcon && <Icon mx="2" color="white" w="2.5em" h="2.5em" as={Logo} title="LangSheets" />}
            <Text fontFamily="cursive" fontSize="x-large" fontWeight="semibold" color="blue.500" mr="2">LangSheets</Text>
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
