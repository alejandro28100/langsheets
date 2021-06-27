import React, { Fragment } from 'react'
import PropTypes from "prop-types";
import { Flex, Spacer, Box, Icon, Menu, MenuList, MenuButton, Button, useMediaQuery, IconButton, Text, MenuItem } from "@chakra-ui/react"
import { FaUserCircle } from "react-icons/fa"
import { HiMenuAlt4 } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi"
import Logo from "./Logo";

import { useUser } from "../context/UserContext";

function Navbar({ leftActions, rightActions, withIcon, sm }) {
    const [isTabletOrLower] = useMediaQuery(["(max-width:900px)"]);
    const { logout, user } = useUser();

    return (
        <Flex px="10" background="white" py="4" shadow="sm"
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

                            {user && <Box>
                                <Menu>
                                    <MenuButton colorScheme="brand" as={IconButton} icon={<Icon w={8} h={8} as={FaUserCircle} />} variant="ghost" />

                                    <MenuList>
                                        <Box p="5">
                                            <Text fontSize="x-large" fontWeight="medium">
                                                {`${user.name} ${user.lastName}`}
                                            </Text>
                                        </Box>
                                        <MenuItem onClick={logout} icon={<Icon as={FiLogOut} />} >
                                            Cerrar Sesión
                                        </MenuItem>
                                    </MenuList>

                                </Menu>

                            </Box>
                            }

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
