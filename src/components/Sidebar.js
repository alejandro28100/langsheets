import React, { Fragment } from 'react';
import { Drawer, DrawerContent, DrawerOverlay, DrawerHeader, DrawerBody, Icon, IconButton, Text } from "@chakra-ui/react";
import { useDisclosure } from '@chakra-ui/hooks';
import { useMediaQuery } from '@chakra-ui/media-query';
import LanguagePicker from './LanguagePicker';
import PublicSwitch from './PublicSwitch';

import PropTypes from "prop-types"

import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";

const Sidebar = ({ handleChangeProp, lang, isPublic }) => {
    const [isTablet] = useMediaQuery(["(max-width: 768px)", "(min-width: 1024px)"]);
    const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure()

    return (
        isTablet
            ? <Fragment>
                <IconButton size="lg" variant="ghost" onClick={onDrawerOpen} icon={<Icon as={AiOutlineMenuFold} />} />

                <Drawer placement="right" onClose={onDrawerClose} isOpen={isDrawerOpen}>
                    <DrawerOverlay>
                        <DrawerContent>
                            <IconButton size="lg" onClick={onDrawerClose} position="absolute" top="0.5" left="0.5" variant="ghost" icon={<Icon as={AiOutlineMenuUnfold} />} />
                            <DrawerHeader>
                                <Text textAlign="center" fontSize="2xl" my="4" fontWeight="medium" letterSpacing="wider">Ajustes</Text>
                            </DrawerHeader>
                            <DrawerBody>
                                <LanguagePicker {...{ handleChangeProp, lang }} />
                                <PublicSwitch {...{ handleChangeProp, isPublic }} />
                            </DrawerBody>
                        </DrawerContent>
                    </DrawerOverlay>
                </Drawer>
            </Fragment>
            : <Fragment>
                <Text textAlign="center" fontSize="2xl" my="4" fontWeight="medium" letterSpacing="wider">Ajustes</Text>
                <LanguagePicker {...{ handleChangeProp, lang }} />
                <PublicSwitch {...{ handleChangeProp, isPublic }} />
            </Fragment>
    )
}

Sidebar.propTypes = {
    handleChangeProp: PropTypes.func.isRequired,
    lang: PropTypes.string,
    isPublic: PropTypes.bool,
}
export default Sidebar
