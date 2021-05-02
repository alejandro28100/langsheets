import React from 'react'
import PropTypes from "prop-types";
import { Flex, Spacer } from "@chakra-ui/react"
import Logo from "./Logo";

function Navbar({ leftActions, rightActions, withIcon }) {

    return (
        <Flex px="10" background="white" py="2" shadow="sm"
            sx={{
                "@media print": {
                    display: "none",
                }
            }}
        >
            <Logo {...withIcon} />

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
    withIcon: PropTypes.bool.isRequired,
}

export default Navbar
