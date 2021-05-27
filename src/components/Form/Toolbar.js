import { Button } from '@chakra-ui/button'
import Icon from '@chakra-ui/icon'
import { Text } from '@chakra-ui/layout'
import { useMediaQuery } from '@chakra-ui/media-query'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu'
import { Tooltip } from '@chakra-ui/tooltip'
import React, { Fragment } from 'react'
import { FaAlignCenter, FaAlignJustify, FaAlignLeft, FaAlignRight, FaBold, FaHeading, FaItalic, FaStrikethrough, FaUnderline } from 'react-icons/fa'
import { HiViewGridAdd } from 'react-icons/hi'
import { useSlate } from 'slate-react'
import { MissingWord as MissingWordIcon, WordOrderIcon } from '../../svgs'
import { createExercise } from '../Slate/commands'
import ToolbarButton from '../Slate/ToolbarButton'

const DesktopToolbar = () => {

    const editor = useSlate();
    const [isDesktop] = useMediaQuery("(min-width: 1024px)")
    return (
        <Fragment>

            <Menu>
                <MenuButton  {...isDesktop ? '' : { ...{ borderRadius: "none", height: "full" } }} flex="0 0 auto" display="flex" as={Button} size="sm" colorScheme="brand" variant="solid">
                    <Icon w={5} h={5} mr="2" as={HiViewGridAdd} /> Insertar Ejercicio
                </MenuButton>
                <MenuList>
                    <MenuItem icon={<Icon w={5} h={5} as={MissingWordIcon} />}
                        onClick={e => createExercise(editor, { type: "missing-word" })}
                    >Palabras faltantes</MenuItem>
                    <MenuItem icon={<Icon w={5} h={5} as={WordOrderIcon} />}
                        onClick={e => createExercise(editor, { type: "word-order" })}
                    >Ordernar oraciones</MenuItem>
                </MenuList>
            </Menu>

            <Menu>
                <Tooltip hasArrow label="Estilos de tipografía" fontSize="md">
                    <MenuButton
                        as={Button}
                        aria-label="Estilos de tipografía"
                        variant="ghost"
                        color="#616161"
                        size="sm"
                    >
                        <Icon as={FaHeading} />
                    </MenuButton>
                </Tooltip>

                <MenuList>
                    <ToolbarButton variant="menuListItem" type="block" format="heading 4xl" label={<Text fontSize="3xl">Título 1</Text>} />
                    <ToolbarButton variant="menuListItem" type="block" format="heading 3xl" label={<Text fontSize="2xl">Título 2</Text>} />
                    <ToolbarButton variant="menuListItem" type="block" format="heading 2xl" label={<Text fontSize="xl">Subtítulo 1</Text>} />
                    <ToolbarButton variant="menuListItem" type="block" format="heading xl" label={<Text fontSize="lg">Subtítulo 2</Text>} />
                    <ToolbarButton variant="menuListItem" type="block" format="" label={<Text fontSize="md">Texto normal</Text>} />
                </MenuList>
            </Menu>

            <ToolbarButton type="mark" format="bold" label="Negrita" icon={<Icon as={FaBold} />} />
            <ToolbarButton type="mark" format="italic" label="Cursiva" icon={<Icon as={FaItalic} />} />
            <ToolbarButton type="mark" format="underline" label="Subrayado" icon={<Icon as={FaUnderline} />} />
            <ToolbarButton type="mark" format="strike" label="Tachado" icon={<Icon as={FaStrikethrough} />} />

            <ToolbarButton type="block" formatKey="textAlign" format="left" label="Alinear a la izquierda" icon={<Icon as={FaAlignLeft} />} />
            <ToolbarButton type="block" formatKey="textAlign" format="center" label="Alinear al centro" icon={<Icon as={FaAlignCenter} />} />
            <ToolbarButton type="block" formatKey="textAlign" format="right" label="Alinear a la derecha" icon={<Icon as={FaAlignRight} />} />
            <ToolbarButton type="block" formatKey="textAlign" format="justify" label="Justificar" icon={<Icon as={FaAlignJustify} />} />

        </Fragment>
    )
}

export default DesktopToolbar
