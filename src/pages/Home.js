import React, { useEffect, Fragment, useReducer } from 'react'
import { useHistory } from "react-router-dom"

import { Grid, Container, Text, Flex, Icon, Button, Skeleton, Alert, AlertDescription, AlertIcon, Progress, useToast } from "@chakra-ui/react"

import WorksheetCard from "../components/WorksheetCard";

import { HiDocumentAdd } from "react-icons/hi";
import useBodyBackground from '../hooks/useBodyBackground';
import Navbar from '../components/Navbar';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { parseWorksheets } from '../utils';
import { useUser } from '../context/UserContext';

// const examples = [
//     {
//         "id": "67e10aff-5431-4c51-8639-06768ebdf48f",
//         "title": "Frases Mexicanas",
//         "content": "[{\"type\":\"heading 2xl\",\"children\":[{\"text\":\"Instrucciones : \"},{\"text\":\"Rellena \",\"bold\":true},{\"text\":\"los \"},{\"text\":\"espacios \",\"italic\":true},{\"text\":\"vacíos como corresponda usando las palabras a continuación\"}],\"textAlign\":\"left\"},{\"type\":\"subtitle\",\"children\":[{\"text\":\"\"}]},{\"type\":\"heading xl\",\"children\":[{\"text\":\"Toluca , nieto ,tortas, pelos, taco, corrió.\",\"bold\":true,\"italic\":true}],\"textAlign\":\"center\"},{\"type\":\"paragraph\",\"textAlign\":\"left\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"textAlign\":\"left\",\"children\":[{\"text\":\"\"}]},{\"type\":\"exercise-block\",\"exerciseType\":\"missing-word\",\"children\":[{\"type\":\"exercise-list-items\",\"children\":[{\"type\":\"paragraph\",\"children\":[{\"text\":\"1. De lengua me hecho un \"},{\"text\":\"taco\",\"missingWord\":true},{\"text\":\" .\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"2. ¿Qué Pachuca por \"},{\"text\":\"Toluca\",\"missingWord\":true},{\"text\":\" ?\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"3. Mejor aquí \"},{\"text\":\"corrió\",\"missingWord\":true},{\"text\":\" que aquí quedó… \"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"textAlign\":\"left\",\"children\":[{\"text\":\"4. Abuelita soy tu \"},{\"text\":\"nieto\",\"missingWord\":true},{\"text\":\" !\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"5. Hablar sin \"},{\"text\":\"pelos\",\"missingWord\":true},{\"text\":\" en la lengua.\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"textAlign\":\"left\",\"children\":[{\"text\":\"6. Me quedé como el perro de las dos \"},{\"text\":\"tortas\",\"missingWord\":true},{\"text\":\" .\"}]}]}]},{\"type\":\"paragraph\",\"textAlign\":\"left\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]",
//         "createdAt": "2021-04-24T01:50:11.979Z",
//         "lang": "es",
//         "isPublic": false
//     },
//     {
//         "id": "1ee461c0-6a59-4092-9832-c2181cb5c402",
//         "title": "El presente de Indicativo",
//         "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"El Presente de Indicativo\",\"bold\":true},{\"text\":\", en español indica que la acción expresada por el verbo se da en el mismo momento en el que se habla. El presente de indicativo es uno de  los tiempos verbales más utilizados y versátiles del español. Por esta misma razón puede ser utilizado en muchos contextos diferentes. \"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Este tiempo verbal no tiene por qué estar ligado únicamente al presente (ahora) sino que puede estar desligado del tiempo o referirse al pasado o al futuro.  \"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Es un tiempo verbal muy versátil que nos sirve tanto para hablar del presente (\"},{\"text\":\"“¿Dónde vives?”\",\"italic\":true},{\"text\":\"), como del futuro (\"},{\"text\":\"“Este verano voy a Sicilia”\",\"italic\":true},{\"text\":\"), del pasado (\"},{\"text\":\"“Cervantes publica la primera parte del Quijote en 1605”\",\"italic\":true},{\"text\":\") y de verdades inmutables (\"},{\"text\":\"“Dos y dos son cuatro”/ “Lo que no mata, engorda” / “El aceite flota en el agua\",\"italic\":true},{\"text\":\"”).\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Además, usamos el presente para hablar de:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"text\":\"–    Cualidades de las cosas\",\"bold\":true},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Es una casa antigua y tiene un patio grande\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Ese libro vale 20 euros\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"text\":\"–    Situaciones regulares\",\"bold\":true},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Pedro normalmente 8 horas al día\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Juan vive en Motril y trabaja en Granada\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"text\":\"–    Situaciones momentáneas\",\"bold\":true},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Mi novio esta semana está en Madrid\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Hoy no puedo trabajar\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"text\":\"–    Cosas que no cambian\",\"bold\":true},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Los gatos comen ratones\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"En verano hace calor\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"El presente del indicativo también se usa para describir:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"text\":\"    \"},{\"text\":\"* Acciones habituales\",\"bold\":true},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\",\"bold\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Cuando una acción se repite en el presente, el pasado y el futuro, normalmente se emplea el presente del indicativo  para describirla.\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Ejemplo:    \"},{\"text\":\" Siempre leo en voz alta.\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"text\":\"* Acciones futuras\",\"bold\":true},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"A veces se describen acciones del futuro empleando el presente para darles más énfasis, color y vida.\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Ejemplos:    \"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"La fiesta empieza a las nueve.\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"La semana que viene hay un eclipse del sol.\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Si abres la boca, ¡estás muerto!\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"text\":\"* El futuro perifrástico\",\"bold\":true},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Se forma el futuro perifrástico con el verbo ir o venir conjugado en el presente.\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Ejemplos:     \"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Vamos a ir con ellos mañana.\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Mi padre viene el mes próximo.\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"text\":\"* Acciones del pasado\",\"bold\":true},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Acciones reportadas en los periódicos, revistas, etc., a menudo emplean el presente para hacerlas más vivas.\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Ejemplos:   \"},{\"text\":\" \",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"El robo tiene lugar el 18 de febrero de 1868. \",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Tres hombres enmascarados entran en el banco, sacan sus pistolas y piden a los empleados que estén tranquilos.\",\"italic\":true}]}]",
//         "createdAt": "2021-04-24T02:42:29.794Z",
//         "lang": "es",
//         "isPublic": true
//     },
//     {
//         "id": "b9e5b43d-63ae-4879-8f40-7280d8432a74",
//         "title": "Vocabulary B1-B2: Health",
//         "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"Complete the sentences using the words below.\",\"bold\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\",\"bold\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"x-ray, medicine, ambulance, dentist, nurse, bandage\",\"italic\":true}],\"textAlign\":\"center\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"exercise-block\",\"exerciseType\":\"missing-word\",\"children\":[{\"type\":\"exercise-list-items\",\"children\":[{\"type\":\"paragraph\",\"children\":[{\"text\":\"A \"},{\"text\":\"nurse\",\"missingWord\":true},{\"text\":\" helps a doctor. They can also help patients who don't have a serious condition.\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\" \"},{\"text\":\" Medicine\",\"missingWord\":true},{\"text\":\" makes us feel better or helps us get better. It comes in many forms.\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"We can put a \"},{\"text\":\"bandage\",\"missingWord\":true},{\"text\":\" around an injury or body part that hurts.\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\" An \"},{\"text\":\"X-ray\",\"missingWord\":true},{\"text\":\" is a picture of our bones.\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"An \"},{\"text\":\"ambulance\",\"missingWord\":true},{\"text\":\" takes people to the hospital quickly.\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"A \"},{\"text\":\"dentist\",\"missingWord\":true},{\"text\":\" checks our teeth.\"}]}]}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]",
//         "createdAt": "2021-04-24T22:18:44.365Z",
//         "lang": "en",
//         "isPublic": true
//     }
// ]

const initialState = {
    error: undefined,
    loading: true,
    worksheets: undefined,
}

function reducer(state, action) {
    switch (action.type) {
        case 'call-api':
            return {
                ...state,
                loading: true
            };
        case 'api-call-ended':
            return {
                ...state,
                loading: false
            }
        case 'update-worksheets':
            return {
                ...state,
                loading: false,
                worksheets: action.payload.worksheets
            }

        case 'api-error':
            return {
                ...state,
                loading: false,
                error: action.payload.error
            }
        default:
            console.warn("The action type given did not match any posible action", action)
            return state;
    }
}

const Home = () => {
    const history = useHistory();
    const toast = useToast();

    const { user } = useUser();
    const [state, dispatch] = useReducer(reducer, initialState)
    const { error, loading, worksheets } = state;

    useEffect(() => {

        async function getWorksheets() {
            dispatch({ type: 'call-api' });

            const response = await fetch("/api/activities");
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'update-worksheets', payload: { worksheets: parseWorksheets(json) } });
                return;
            }
            dispatch({ type: 'api-error', payload: { error: json } })

        }

        getWorksheets()

    }, [])

    async function handleCreateWorksheet() {

        dispatch({ type: 'call-api' });

        const newWorksheet = {
            title: "Actividad sin título",
            lang: "es",
            published: false,
            content: JSON.stringify([{
                type: 'paragraph',
                children: [{ text: '' }]
            }]),
            createdAt: new Date(),
            author: {
                name: user.name,
                lastName: user.lastName,
                id: user.id
            }
        }

        const response = await fetch("/api/activities", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newWorksheet)
        })

        const json = await response.json();

        dispatch({ type: 'api-call-ended' });

        if (response.ok) {
            // console.log(json);
            //Redirect to the form page with the id of the document created
            history.push(`/worksheets/${json._id}/edit`);
            return;
        }

        dispatch({ type: 'api-error', payload: { error: json } });
    }

    async function handleDeleteWorksheet(id) {
        dispatch({ type: 'call-api' });

        const response = await fetch(`/api/activities/${id}`, {
            method: "DELETE"
        })

        const json = response.json();

        if (response.ok) {

            const updatedWorksheets = [...worksheets].filter(worksheet => worksheet._id !== id);

            dispatch({ type: 'update-worksheets', payload: { worksheets: updatedWorksheets } });

            toast({
                title: "Actividad Eliminada",
                description: "La actividad fue eliminada exitósamente",
                status: "info",
                durarion: 5000,
                isClosable: true
            })
            return;
        }

        dispatch({ type: 'api-error', payload: { error: json } });
    }

    const worksheetsHandler = {
        createSheet: handleCreateWorksheet,
        deleteSheet: handleDeleteWorksheet,
    }

    useBodyBackground("var(--chakra-colors-gray-100)")
    useDocumentTitle(`LangSheets | Mis actividades`);
    return (
        <Fragment>

            <Navbar />
            { loading &&
                <Progress size="xs" isIndeterminate
                    sx={{
                        "& > div": {
                            background: "var(--chakra-colors-brand-300)"
                        }
                    }}
                />
            }
            { error &&
                <Alert status="error">
                    <AlertIcon />
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            }

            <Container maxW="container.lg" >
                <Text fontSize="xx-large" fontWeight="semibold" my="5" textAlign={["center", "left"]}> Mis Worksheets </Text>


                <Grid
                    mx={{ md: "7", lg: "0" }}
                    gap="5"
                    justifyContent="center"
                    placeItems="center"
                    templateColumns={{ base: "", md: "repeat(2, var(--chakra-sizes-72))", lg: "repeat(3, minmax(var(--chakra-sizes-72),var(--chakra-sizes-80)))" }}
                >
                    {!!worksheets && worksheets.map(worksheet => (
                        <Skeleton key={worksheet._id} isLoaded={!loading} >
                            <WorksheetCard
                                {...{ ...worksheet, ...worksheetsHandler }}
                            />
                        </Skeleton>
                    ))
                    }
                    <Flex width="full" as={Button} colorScheme="brand" variant="ghost" background="white" onClick={worksheetsHandler.createSheet} leftIcon={<Icon as={HiDocumentAdd} />} size="lg" boxShadow="base" height="40" borderRadius="xl">
                        Crear Nueva actividad
                        </Flex>
                </Grid>

            </Container>
        </Fragment>

    )
}


export default Home
