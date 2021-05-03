import React, { useState, useEffect, Fragment } from 'react'
import { useHistory } from "react-router-dom"
import { v4 as uuid } from "uuid";

import { Grid, Container, Text, Flex, Icon, Button } from "@chakra-ui/react"

import WorksheetCard from "../components/WorksheetCard";

import { HiDocumentAdd } from "react-icons/hi";
import useBodyBackground from '../hooks/useBodyBackground';
import Navbar from '../components/Navbar';
import useDocumentTitle from '../hooks/useDocumentTitle';

const examples = [
    {
        "id": "67e10aff-5431-4c51-8639-06768ebdf48f",
        "title": "Frases Mexicanas",
        "content": "[{\"type\":\"heading 2xl\",\"children\":[{\"text\":\"Instrucciones : \"},{\"text\":\"Rellena \",\"bold\":true},{\"text\":\"los \"},{\"text\":\"espacios \",\"italic\":true},{\"text\":\"vacíos como corresponda usando las palabras a continuación\"}],\"textAlign\":\"left\"},{\"type\":\"subtitle\",\"children\":[{\"text\":\"\"}]},{\"type\":\"heading xl\",\"children\":[{\"text\":\"Toluca , nieto ,tortas, pelos, taco, corrió.\",\"bold\":true,\"italic\":true}],\"textAlign\":\"center\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"1. De lengua me hecho un \"},{\"text\":\"taco\",\"missingWord\":true},{\"text\":\" \"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"2. ¿Qué Pachuca por \"},{\"text\":\"Toluca\",\"missingWord\":true},{\"text\":\" ?\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"3. Mejor aquí \"},{\"text\":\"corrió\",\"missingWord\":true},{\"text\":\" que aquí quedó… \"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"textAlign\":\"left\",\"children\":[{\"text\":\"4.  Abuelita soy tu \"},{\"text\":\"nieto\",\"missingWord\":true},{\"text\":\" !\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"5. Hablar sin \"},{\"text\":\"pelos\",\"missingWord\":true},{\"text\":\" en la lengua.\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}],\"textAlign\":\"left\"},{\"type\":\"paragraph\",\"textAlign\":\"left\",\"children\":[{\"text\":\"6. Me quedé como el perro de las dos \"},{\"text\":\"tortas\",\"missingWord\":true},{\"text\":\" .\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]",
        "createdAt": "2021-04-24T01:50:11.979Z",
        "lang": "es",
        "isPublic": true
    },
    {
        "id": "52ff329e-c900-4826-b241-84bf9112caa0",
        "title": "Mi actividad 3",
        "content": "[{\"type\":\"title\",\"children\":[{\"text\":\"Contenido Estático\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Este es el \"},{\"text\":\"contenido \",\"bold\":true},{\"text\":\"de mi actividad \"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"El editor puede también ser utilizado para mostrar contenido estático sin ejercicios\"}]}]",
        "createdAt": "2021-04-24T02:41:45.933Z",
        "lang": "en",
        "isPublic": true
    },
    {
        "id": "1ee461c0-6a59-4092-9832-c2181cb5c402",
        "title": "El presente de Indicativo",
        "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"El Presente de Indicativo\",\"bold\":true},{\"text\":\", en español indica que la acción expresada por el verbo se da en el mismo momento en el que se habla. El presente de indicativo es uno de  los tiempos verbales más utilizados y versátiles del español. Por esta misma razón puede ser utilizado en muchos contextos diferentes. \"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Este tiempo verbal no tiene por qué estar ligado únicamente al presente (ahora) sino que puede estar desligado del tiempo o referirse al pasado o al futuro.  \"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Es un tiempo verbal muy versátil que nos sirve tanto para hablar del presente (\"},{\"text\":\"“¿Dónde vives?”\",\"italic\":true},{\"text\":\"), como del futuro (\"},{\"text\":\"“Este verano voy a Sicilia”\",\"italic\":true},{\"text\":\"), del pasado (\"},{\"text\":\"“Cervantes publica la primera parte del Quijote en 1605”\",\"italic\":true},{\"text\":\") y de verdades inmutables (\"},{\"text\":\"“Dos y dos son cuatro”/ “Lo que no mata, engorda” / “El aceite flota en el agua\",\"italic\":true},{\"text\":\"”).\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Además, usamos el presente para hablar de:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"text\":\"–    Cualidades de las cosas\",\"bold\":true},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Es una casa antigua y tiene un patio grande\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Ese libro vale 20 euros\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"text\":\"–    Situaciones regulares\",\"bold\":true},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Pedro normalmente 8 horas al día\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Juan vive en Motril y trabaja en Granada\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"text\":\"–    Situaciones momentáneas\",\"bold\":true},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Mi novio esta semana está en Madrid\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Hoy no puedo trabajar\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"text\":\"–    Cosas que no cambian\",\"bold\":true},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Los gatos comen ratones\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"En verano hace calor\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"El presente del indicativo también se usa para describir:\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"text\":\"    \"},{\"text\":\"* Acciones habituales\",\"bold\":true},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\",\"bold\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Cuando una acción se repite en el presente, el pasado y el futuro, normalmente se emplea el presente del indicativo  para describirla.\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Ejemplo:    \"},{\"text\":\" Siempre leo en voz alta.\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"text\":\"* Acciones futuras\",\"bold\":true},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"A veces se describen acciones del futuro empleando el presente para darles más énfasis, color y vida.\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Ejemplos:    \"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"La fiesta empieza a las nueve.\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"La semana que viene hay un eclipse del sol.\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Si abres la boca, ¡estás muerto!\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"text\":\"* El futuro perifrástico\",\"bold\":true},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Se forma el futuro perifrástico con el verbo ir o venir conjugado en el presente.\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Ejemplos:     \"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Vamos a ir con ellos mañana.\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Mi padre viene el mes próximo.\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"text\":\"* Acciones del pasado\",\"bold\":true},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Acciones reportadas en los periódicos, revistas, etc., a menudo emplean el presente para hacerlas más vivas.\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Ejemplos:   \"},{\"text\":\" \",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"El robo tiene lugar el 18 de febrero de 1868. \",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Tres hombres enmascarados entran en el banco, sacan sus pistolas y piden a los empleados que estén tranquilos.\",\"italic\":true}]}]",
        "createdAt": "2021-04-24T02:42:29.794Z",
        "lang": "es",
        "isPublic": true
    },
    {
        "id": "b9e5b43d-63ae-4879-8f40-7280d8432a74",
        "title": "Vocabulary B1-B2: Health",
        "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"Complete the sentences using the words below.\",\"bold\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\",\"bold\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"x-ray, medicine, ambulance, dentist, nurse, bandage,\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\",\"italic\":true}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"A \"},{\"text\":\"nurse\",\"missingWord\":true},{\"text\":\" helps a doctor. They can also help patients who don't have a serious condition.\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"Medicine\",\"missingWord\":true},{\"text\":\" makes us feel better or helps us get better. It comes in many forms.\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"We can put a \"},{\"text\":\"bandage\",\"missingWord\":true},{\"text\":\" around an injury or body part that hurts.\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\" An \"},{\"text\":\"X-ray\",\"missingWord\":true},{\"text\":\" is a picture of our bones.\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"An \"},{\"text\":\"ambulance\",\"missingWord\":true},{\"text\":\" takes people to the hospital quickly.\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"A \"},{\"text\":\"dentist\",\"missingWord\":true},{\"text\":\" cheks our teeth.\"}]}]",
        "createdAt": "2021-04-24T22:18:44.365Z",
        "lang": "en",
        "isPublic": true
    }
]

const Home = () => {
    const history = useHistory();
    const host = window.location.host;
    const [worksheets, setWorksheets] = useState([]);

    useEffect(() => {
        //if user has worksheets record in localStorage 
        //get the worksheets
        if (localStorage.getItem("worksheets")) {
            console.log("Getting existing record");
            const data = JSON.parse(localStorage.getItem("worksheets"));
            setWorksheets(data);
        } else {
            //create example worksheets
            localStorage.setItem("worksheets", JSON.stringify(examples));

            const data = JSON.parse(localStorage.getItem("worksheets"));

            setWorksheets(data);
        }
    }, [])

    function handleCreateWorksheet() {
        const newWorksheet = {
            id: uuid(),
            title: "",
            content: JSON.stringify([{
                type: 'paragraph',
                children: [{ text: '' }]
            }]),
            createdAt: new Date()
        }

        try {
            const updatedWorksheets = [...worksheets, newWorksheet];
            //save the worksheet into localStorage
            localStorage.setItem("worksheets", JSON.stringify(updatedWorksheets));

            const data = JSON.parse(localStorage.getItem("worksheets"));
            //if the item was added , update the state
            setWorksheets(data);

            //Redirect to the form page with the id of the record created
            history.push(`${host}/worksheets/${newWorksheet.id}/edit`);
        } catch (err) {
            //show error in case if the user has disabled storage for the site, or if the quota has been exceeded
            alert(err);
        }
    }

    function handleDeleteWorksheet(id) {
        try {
            const updatedWorksheets = [...worksheets]
                .filter(worksheet => worksheet.id !== id);

            console.log(updatedWorksheets);

            localStorage.setItem("worksheets", JSON.stringify(updatedWorksheets));

            const data = JSON.parse(localStorage.getItem("worksheets"));

            // if the worksheet was successfully deleted, update the state 
            setWorksheets(data);

        } catch (err) {
            //show error in case if the user has disabled storage for the site
            alert(err);
        }
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

            <Container maxW="container.lg" >
                <Text fontSize="xx-large" fontWeight="semibold" my="5" textAlign={["center", "left"]}> Mis Worksheets </Text>

                {
                    worksheets.length !== 0
                        ? (
                            <Grid
                                mx={{ md: "7", lg: "0" }}
                                gap="5"
                                justifyContent="center"
                                placeItems="center"
                                templateColumns={{ base: "", md: "repeat(2, var(--chakra-sizes-72))", lg: "repeat(3, minmax(var(--chakra-sizes-72),var(--chakra-sizes-80)))" }}
                            >
                                {worksheets.map(worksheet =>
                                    <WorksheetCard
                                        key={worksheet.id}
                                        {...{ ...worksheet, ...worksheetsHandler }}
                                    />)
                                }
                                <Flex width="full" as={Button} colorScheme="blue" variant="ghost" background="white" onClick={worksheetsHandler.createSheet} leftIcon={<Icon as={HiDocumentAdd} />} size="lg" boxShadow="base" height="40" borderRadius="xl">
                                    Crear Nueva actividad
                                </Flex>
                            </Grid>
                        )
                        : (
                            <Fragment>
                                <Text fontSize="lg" fontWeight="semibold">Aun no has creado una worksheet</Text>
                                <Flex as={Button} colorScheme="blue" variant="ghost" background="white" onClick={worksheetsHandler.createSheet} leftIcon={<Icon as={HiDocumentAdd} />} size="lg" boxShadow="base" height="40" borderRadius="xl">
                                    Crear Nueva actividad
                                </Flex>
                            </Fragment>
                        )
                }
            </Container>
        </Fragment>

    )
}


export default Home
