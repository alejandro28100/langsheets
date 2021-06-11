import { Button, ButtonGroup } from '@chakra-ui/button'
import { Image } from '@chakra-ui/image';
import { Box, Circle, Flex, Stack, Text, } from '@chakra-ui/layout'
import React, { Fragment } from 'react'
import Logo from "../components/Logo";
import { useUser } from '../context/UserContext';

const Home = () => {
    const { user } = useUser();
    return (
        <Fragment>

            <Box mx="auto" width="container.xl">

                <Flex justifyContent="space-between" alignItems="center" py="5">
                    <Logo />
                    {user
                        ? (
                            <Button as="a" href="/dashboard" colorScheme="brand" variant="solid">
                                Mis actividades
                            </Button>
                        )
                        : (
                            <ButtonGroup spacing="5">
                                <Button as="a" href="/login" colorScheme="brand" variant="outline">
                                    Iniciar Sesión
                                </Button>
                                <Button as="a" href="/signup" variant="solid" colorScheme="brand">
                                    Crear Cuenta
                                </Button>
                            </ButtonGroup>
                        )
                    }
                </Flex>

                <Flex flexDirection={["column", "row"]} alignItems="center" my="5" >
                    <Box w={"40%"}>
                        <Text lineHeight="8" textAlign={["center", "left"]}>
                            <Text as="span" fontWeight="bold" fontSize="xxx-large">Actividades digitales</Text>{" "}
                            <Text as="span" color="brand.300" fontWeight="bold" fontSize="xxx-large">Interactivas</Text>
                        </Text>
                        <Text fontSize="x-large">
                            para entornos virtuales de aprendizaje.
                        </Text>
                        {
                            user
                                ? (
                                    <Button my="5" size="lg" as="a" href="/dashboard" colorScheme="brand" variant="solid">
                                        Mis actividades
                                    </Button>
                                ) : (
                                    <Button my="5" size="lg" as="a" href="/signup" variant="solid" colorScheme="brand">
                                        Pruébalo gratis
                                    </Button>
                                )
                        }

                    </Box>
                    <Image w="60%" objectFit="cover" src="/hero.svg" />
                </Flex >
            </Box >

            <Flex my="5" p="10" w="full" position="relative" alignItems="center">
                <Box mt="80" mx="auto" width="container.xl">
                    <Box w={"40%"}>

                        <Text color="brand.300" fontWeight="bold" fontSize="xx-large" my="10">
                            ¿Cómo funciona?
                        </Text>

                        <Stack spacing="5">

                            <Flex>
                                <Circle fontSize="x-large" fontWeight="bold" size="50px" bg="brand.300" color="white">
                                    1
                                </Circle>
                                <Box ml="5">
                                    <Text fontSize="x-large" fontWeight="bold">Crea una actividad</Text>
                                    <Text>Elige una plantilla o comienza una actividad desde cero. Inserta el contenido que necesites (imágenes, videos etc.)</Text>
                                </Box>
                            </Flex>

                            <Flex>
                                <Circle fontSize="x-large" fontWeight="bold" size="50px" bg="brand.300" color="white">
                                    2
                                </Circle>
                                <Box ml="5">
                                    <Text fontSize="x-large" fontWeight="bold">Publica tu actividad</Text>
                                    <Text>Cambia el estado de tu actividad de borrador a publicado en un solo click.</Text>
                                </Box>
                            </Flex>

                            <Flex>
                                <Circle fontSize="x-large" fontWeight="bold" size="50px" bg="brand.300" color="white">
                                    2
                                </Circle>
                                <Box ml="5">
                                    <Text fontSize="x-large" fontWeight="bold">Comparte el link de tu actividad</Text>
                                    <Text>
                                        Por cada actividad creada un link único será generado para que los alumnos puedan realizar las actividades en tiempo real.
                                    </Text>
                                </Box>
                            </Flex>
                        </Stack>
                    </Box>
                    <Image position="absolute" top="0.5" right="0.5" src="/figurebg.svg" />
                    <Image position="absolute" right="425px" top="310px" title="Crea una actividad" src="/figure1.svg" />
                    <Image position="absolute" right="400px" top="700px" title="Comparte una actividad" src="/figure2.svg" />
                    <Image position="absolute" right="103px" top="470px" title="Publica una actividad" src="/figure3.svg" />
                </Box>

            </Flex>
        </Fragment>
    )
}

export default Home
