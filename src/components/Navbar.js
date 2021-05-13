import React, { Fragment } from 'react'
import PropTypes from "prop-types";
import { Flex, Spacer, Icon, Menu, MenuList, MenuButton, Button, useMediaQuery } from "@chakra-ui/react"
import { HiMenuAlt4 } from "react-icons/hi";
import Logo from "./Logo";


function Navbar({ leftActions, rightActions, withIcon, sm }) {
    const [isTabletOrLower] = useMediaQuery(["(max-width:900px)"]);
    return (
        <Flex px="10" background="white" py="2" shadow="sm"
            sx={{
                "@media print": {
                    display: "none",
                }
            }}
        >
            <Logo {...withIcon} />

            {
                isTabletOrLower
                    ? (
                        sm && <Fragment>
                            <Spacer />
                            <Menu>
                                <MenuButton colorScheme="purple" variant="ghost" as={Button} children={<Icon as={HiMenuAlt4} />} />
                                <MenuList zIndex="dropdown">
                                    {sm}
                                </MenuList>
                            </Menu>
                        </Fragment>
                    )
                    : (
                        <Fragment>

                            {leftActions}
                            <Spacer />
                            {rightActions}
                        </Fragment>
                    )
            }

        </Flex>
    )
};

Navbar.defaultProps = {
    withIcon: true
}

Navbar.propTypes = {
    sm: PropTypes.node,
    leftActions: PropTypes.node,
    rightActions: PropTypes.node,
    withIcon: PropTypes.bool.isRequired,
}

export default Navbar
