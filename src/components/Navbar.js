import React, { Fragment } from 'react'
import PropTypes from "prop-types";
import { Flex, Spacer, Box, Icon, Menu, MenuList, MenuButton, Button, useMediaQuery, IconButton, Text, MenuItem, MenuDivider } from "@chakra-ui/react"
import { FaUserCircle } from "react-icons/fa"
import { HiMenuAlt4 } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi"
import { Logo } from "../svgs/index";

import { useUser } from "../context/UserContext";

function Navbar({ leftActions, rightActions, withIcon, sm }) {
    const [isTabletOrLower] = useMediaQuery(["(max-width:900px)"]);
    const { logout, user, loading } = useUser();

    return (
        <Flex px="10" background="white" py="4" shadow="sm" alignItems="center"
            sx={{
                "@media print": {
                    display: "none",
                }
            }}
        >
            <Button as="a" href="/" variant="unstyled">
                <Icon w={10} h={10} as={Logo} />
            </Button>

            {
                isTabletOrLower
                    ? (
                        <Fragment>
                            <Spacer />
                            <Menu>
                                <MenuButton colorScheme="brand" variant="ghost" as={Button} children={<Icon as={HiMenuAlt4} />} />
                                <MenuList zIndex="dropdown">
                                    {
                                        !loading && (
                                            <Fragment>
                                                <Text p="4" fontSize="x-large" fontWeight="medium">
                                                    {`${user.name} ${user.lastName}`}
                                                </Text>
                                                <MenuItem onClick={logout} icon={<Icon as={FiLogOut} />} >
                                                    Cerrar Sesión
                                                </MenuItem>
                                            </Fragment>
                                        )
                                    }

                                    {!!sm && <MenuDivider />}
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
                                    <MenuButton variant="ghost" colorScheme="brand" as={IconButton} icon={<Icon w={8} h={8} as={FaUserCircle} />} />

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
