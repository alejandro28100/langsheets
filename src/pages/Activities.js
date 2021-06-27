// @refresh reset
import React, { useEffect, Fragment, useState } from 'react'

import { Grid, Input, IconButton, InputGroup, InputLeftAddon, Box, Flex, Button, ButtonGroup, Tooltip, Modal, ModalHeader, ModalBody, ModalOverlay, ModalContent, ModalFooter, ModalCloseButton, Text, Icon, useDisclosure, Divider, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"

import { Logo } from '../svgs';

import { FaChevronDown, FaClone, FaLanguage, FaSearch, FaUser, FaUserAlt } from 'react-icons/fa';

import { createQueryString, parseWorksheets } from "../utils/index";
import useSlateRender from '../hooks/useSlateRender';
import useSlateEditor from '../hooks/useSlateEditor';
import { Slate } from 'slate-react';
import CustomEditable from '../components/Slate/Editable';
import useBodyBackground from '../hooks/useBodyBackground';

const LANGS = {
    es: "Español",
    en: "Inglés",
    fr: "Francés",
    ru: "Ruso",
    de: "Alemán",
    it: "Italiano",
    jp: "Japonés",
}


const Activities = () => {

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);

    //filters
    const [language, setLanguage] = useState(undefined);
    const [keywords, setKeywords] = useState("");


    async function getActivities() {
        try {
            setLoading(true);
            const params = {};

            if (language) params.language = language;
            if (!!keywords.trim()) params.keywords = keywords;

            const response = await fetch(`/api/activities/public?${Object.keys(params).length !== 0 && createQueryString(params)}`);
            const json = await response.json();

            const activities = parseWorksheets(json);
            setActivities(activities);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getActivities();
    }, [language])

    if (error) return <Box>Error</Box>;

    return (

        <Fragment>

            <Flex bg="white" width="full" p="5">

                <Text as="a" href="/">
                    <Icon w={12} h={12} as={Logo} mr="4" />
                </Text>

                <InputGroup width="50%" mr="4">
                    <InputLeftAddon onClick={getActivities}>
                        <Icon as={FaSearch} />
                    </InputLeftAddon>
                    <Input
                        value={keywords}
                        onKeyDown={(e) => e.key === "Enter" && getActivities()}
                        onChange={(event) => setKeywords(event.target.value)}
                        placeholder="Busca actividades de otros profesores"
                    />
                </InputGroup>


                <Menu>
                    <Tooltip hasArrow label="Filtrar por idioma">
                        <MenuButton as={Button} leftIcon={<Icon as={FaLanguage} />} rightIcon={<Icon as={FaChevronDown} />} >
                            {language ? LANGS[language] : "Seleccionar Idioma"}
                        </MenuButton>
                    </Tooltip>
                    <MenuList zIndex="dropdown">
                        <MenuItem onClick={() => setLanguage("en")}>Inglés</MenuItem>
                        <MenuItem onClick={() => setLanguage("fr")}>Francés</MenuItem>
                        <MenuItem onClick={() => setLanguage("es")}>Español</MenuItem>
                        <MenuItem onClick={() => setLanguage("ru")}>Ruso</MenuItem>
                        <MenuItem onClick={() => setLanguage("de")}>Aleman</MenuItem>
                        <MenuItem onClick={() => setLanguage("it")}>Italiano</MenuItem>
                        <MenuItem onClick={() => setLanguage("jp")}>Japonés</MenuItem>
                    </MenuList>
                </Menu>

            </Flex>

            <Grid mx="auto" px={["0px"]} width="container.lg" templateColumns={["1fr", "repeat(3, 1fr)"]} gap={6} p="5">

                {
                    !loading && activities.map((activity) => (
                        <AcitivityCard key={activity._id} {...activity} />
                    ))
                }

                {
                    !loading && activities.length === 0 && (
                        <Box>
                            Ninguna actividad fue encontrada :(
                        </Box>
                    )
                }

            </Grid>
        </Fragment>
    )
}



const AcitivityCard = props => {
    const { _id, author, content, createdAt, lang, title } = props;

    const username = `${author.name} ${author.lastName}`;
    const editor = useSlateEditor({
        plugins: false
    });

    const [renderLeaf, renderElement] = useSlateRender();

    const { isOpen, onOpen, onClose } = useDisclosure();

    useBodyBackground("var(--chakra-colors-gray-100)")

    return (
        <Slate {...{
            editor,
            value: content
        }}>
            <Box w={["100%", "80"]} bg="white" h={["70vh", "60vh"]} transition="ease 0.5s transform" overflowY="hidden" boxShadow="base"  >

                <Box cursor="zoom-in" position="relative" h={["60vh", "50vh"]} overflowY="auto">
                    <Box width="100%" height="100%" position="absolute" top="0" left="0" zIndex="1" onClick={onOpen} />
                    <Box>
                        <CustomEditable {...{
                            readOnly: true,
                            renderElement,
                            renderLeaf
                        }} />
                    </Box>
                </Box>

                <Flex zIndex="2" bg="brand.700" color="white" alignItems="center" justifyContent="space-between" width="full" position="sticky" bottom="0" left="0" p="5">
                    <Box>
                        <Text isTruncated fontSize="large">{title}</Text>
                        <Text > <Icon as={FaLanguage} /> {LANGS[lang]}</Text>
                        <Text isTruncated> <Icon as={FaUserAlt} /> {username}</Text>
                    </Box>
                    <Tooltip hasArrow label="Clonar actividad">
                        <Button alignSelf="flex-start" variant="outline" colorScheme="white"> <Icon as={FaClone} /> </Button>
                    </Tooltip>
                </Flex>

                <Modal {...{ isOpen, onClose }} size="2xl">
                    <ModalOverlay />
                    <ModalContent bg="gray.100">
                        <ModalCloseButton />
                        <ModalHeader>{title}</ModalHeader>
                        <ModalBody position="relative">
                            <Box width="100%" height="100%" position="absolute" top="0" left="0" zIndex="1" />

                            <Text mb="5"> <Icon as={FaUserAlt} /> {username}</Text>

                            <Box bg="white" boxShadow="base">

                                <CustomEditable
                                    {...{
                                        readOnly: true,
                                        renderElement,
                                        renderLeaf
                                    }}
                                />

                            </Box>
                        </ModalBody>
                        <ModalFooter>
                            <ButtonGroup>
                                <Button variant="ghost" onClick={onClose}>Cerrar</Button>
                                <Button rightIcon={<Icon as={FaClone} />} colorScheme="brand">Clonar Actividad</Button>
                            </ButtonGroup>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box >
        </Slate >
    )
}

export default Activities
