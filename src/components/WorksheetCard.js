import React, { Fragment, useState, useRef } from 'react'
import PropTypes from "prop-types"
import { Text, Icon, ButtonGroup, IconButton, Button, Spacer, Flex, Tooltip, AlertDialog, AlertDialogBody, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogFooter } from "@chakra-ui/react"

import { FaChalkboardTeacher } from "react-icons/fa";
import { MdDelete, MdPublic } from "react-icons/md";
import { RiFileEditFill } from "react-icons/ri";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import { SiGoogletranslate } from "react-icons/si";


const LANGUAGES = {
    es: "Español",
    en: "Inglés",
    fr: "Francés",
    ru: "Ruso",
    de: "Alemán",
    ja: "Japonés",
    zh: "Chino"
}

function WorksheetCard({ lang, title, id, createdAt, deleteSheet, isPublic }) {
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const onClose = () => setIsAlertOpen(false);
    const cancelRef = useRef();

    return (
        <Fragment>

            <Flex boxShadow="base" background="gray.50" height="40" borderRadius="xl">
                <Flex padding="5" flexDirection="column">
                    <Text fontFamily="sans-serif" fontSize="large" fontWeight="semibold">{title === "" ? "Sin título" : title}</Text>
                    <Spacer />

                    {LANGUAGES[lang] && <Text >
                        <Icon mr="2" as={SiGoogletranslate} />
                        {LANGUAGES[lang]}
                    </Text>}

                    <Text>
                        <Icon mr="2" as={isPublic ? MdPublic : RiGitRepositoryPrivateFill} />
                        Actividad {isPublic ? "Pública" : "Privada"}
                    </Text>


                </Flex>
                <Spacer />
                <Flex pr="5" py="5">
                    <ButtonGroup as={Flex} flexDirection="column" alignItems="center" justifyContent="space-evenly" spacing="0" size="lg" colorScheme="blue" variant="ghost">

                        <Tooltip hasArrow label="Comenzar Actividad" >
                            <IconButton as="a" href={`http://localhost:3000/worksheets/${id}/practice`} icon={<Icon as={FaChalkboardTeacher} />} />
                        </Tooltip>

                        <Tooltip hasArrow label="Editar Actividad">
                            <IconButton as="a" href={`http://localhost:3000/worksheets/${id}/edit`} icon={<Icon as={RiFileEditFill} />} />
                        </Tooltip>

                        <Tooltip hasArrow label="Eliminar Actividad">
                            <IconButton onClick={e => setIsAlertOpen(true)} icon={<Icon as={MdDelete} />} />
                        </Tooltip>
                    </ButtonGroup>
                </Flex>
            </Flex >

            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Eliminar Actividad
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            ¿Estás seguro de querer borrar esta actividad? Esta acción es irreversible.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button colorScheme="red" onClick={e => deleteSheet(id)} ml={3}>
                                Eliminar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Fragment>
    )
}

WorksheetCard.defaultProps = {
    lang: "",
    isPublic: true,
}

WorksheetCard.propTypes = {
    lang: PropTypes.oneOf(["en", "fr", "de", "ja", "es", "zh", "ru", ""]).isRequired,
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    isPublic: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
    deleteSheet: PropTypes.func.isRequired,
}

export default WorksheetCard


