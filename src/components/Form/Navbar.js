import Icon from '@chakra-ui/icon'
import { Box, Flex } from '@chakra-ui/layout'
import { useMediaQuery } from '@chakra-ui/media-query'
import { Tooltip } from '@chakra-ui/tooltip'
import React, { Fragment } from 'react'
import { FaChalkboardTeacher, FaPrint } from 'react-icons/fa'
import { Logo } from '../../svgs'


const Navbar = (props) => {
    const [isDesktop] = useMediaQuery(["(min-width: 768px)"]);
    return (

        isDesktop
            ? (
                <Fragment>
                    <Flex flexDirection="column" alignItems="center">

                        <Box px="4" variant="unstyled" _focus={{ outline: "none" }} as="a" href="/">
                            <Logo width="70px" />
                        </Box>

                        <Flex mt="40" flexDirection="column" flexGrow="1" width="full">

                            <Tooltip hasArrow arrowSize="5" placement="auto-start" label="Previsualizar actividad">
                                <Box
                                    as="a" target="_blank" referrerPolicy="no-referrer" href={`/worksheets/${props.id}/practice`}
                                    sx={{
                                        "&": {
                                            transition: "all ease 300ms",
                                            color: "white",
                                            cursor: "pointer",
                                            textAlign: "center",
                                            borderRadius: "none"
                                        },
                                        "&:hover, &:active": {
                                            background: "#252388"
                                        }
                                    }}
                                >
                                    <Icon m="4" w={8} h={8} as={FaChalkboardTeacher} />
                                </Box>
                            </Tooltip>

                            <Tooltip hasArrow arrowSize="5" placement="auto-start" label="Imprimir actividad">
                                <Box
                                    onClick={props.handlePrint}
                                    sx={{
                                        "&": {
                                            transition: "all ease 300ms",
                                            color: "white",
                                            cursor: "pointer",
                                            textAlign: "center",
                                            borderRadius: "none"
                                        },
                                        "&:hover, &:active": {
                                            background: "#252388"
                                        }
                                    }}
                                >
                                    <Icon m="4" w={8} h={8} as={FaPrint} />
                                </Box>
                            </Tooltip>

                        </Flex>

                    </Flex>
                </Fragment>
            )
            : null

    )
}


export default Navbar
