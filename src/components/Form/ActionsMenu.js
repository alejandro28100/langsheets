import React, { Fragment } from 'react'
import { useSlate } from 'slate-react'
import useIsFullscreen from '../../hooks/useIsFullscreen'

import Icon from '@chakra-ui/icon'
import { Menu, MenuButton, MenuGroup, MenuItem, MenuList } from '@chakra-ui/menu'

import { isFullscreen } from '../../utils'
import { createExercise } from '../Slate/commands'
import { BsFullscreen, BsFullscreenExit } from 'react-icons/bs'
import { FaFileUpload, FaPrint } from 'react-icons/fa'
import { MissingWord as MissingWordIcon, WordOrderIcon } from '../../svgs'



const ActionsMenu = (props) => {
    const { handlePublishActivity, worksheet } = props;
    const editor = useSlate();
    const isFullscreen = useIsFullscreen();

    return (
        <Fragment>
            <Menu>
                <MenuButton>Actividad</MenuButton>
                <MenuList>
                    <MenuItem onClick={handlePublishActivity} icon={<Icon as={FaFileUpload} />} >
                        {worksheet?.published
                            ? "Anular Publicación"
                            : "Publicar Actividad"
                        }
                    </MenuItem>
                    <MenuItem icon={<Icon as={FaPrint} />} onClick={handlePrint}>Imprimir Actividad</MenuItem>
                </MenuList>
            </Menu>
            <Menu>
                <MenuButton mx="4">Insertar</MenuButton>
                <MenuList>
                    <MenuGroup title="Ejercicios">
                        <MenuItem icon={<Icon w={8} h={8} as={MissingWordIcon} />} onClick={e => createExercise(editor, { type: "missing-word" })}>Palabras Faltantes</MenuItem>
                        <MenuItem icon={<Icon w={8} h={8} as={WordOrderIcon} />} onClick={e => createExercise(editor, { type: "word-order" })}>Ordenar Oraciones</MenuItem>
                    </MenuGroup>
                </MenuList>
            </Menu>
            <Menu>
                <MenuButton mx="4">Ver</MenuButton>
                <MenuList>
                    {
                        isFullscreen
                            ? <MenuItem icon={<Icon as={BsFullscreenExit} />} onClick={handleCloseFullscreen}>Vista normal</MenuItem>
                            : <MenuItem icon={<Icon as={BsFullscreen} />} onClick={handleOpenFullscreen}>Pantalla completa</MenuItem>
                    }
                </MenuList>
            </Menu>
        </Fragment>
    )
}

function handlePrint(e) {
    //set print preview scale to 100%
    document.body.style.zoom = "100%";

    //Deselect the button so the tooltip disappears
    e.target.blur();

    //Open the native print browser dialog
    //with a delay to prevent the button tooltip apearing on the printing preview 
    setTimeout(() => {
        window.print();
    }, 500)
}

function handleOpenFullscreen() {

    if (isFullscreen()) return;

    let screen = document.documentElement;

    if (screen.requestFullscreen) {
        screen.requestFullscreen();
    } else if (screen.mozRequestFullScreen) { /*Firefox*/
        screen.mozRequestFullScreen();
    } else if (screen.webkitRequestFullscreen) { /* Safari */
        screen.webkitRequestFullscreen();
    } else if (screen.msRequestFullscreen) { /* IE11 */
        screen.msRequestFullscreen();
    }
}

function handleCloseFullscreen() {

    if (!isFullscreen()) return;

    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /*Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}



export default ActionsMenu
