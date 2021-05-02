import React, { useState, useEffect, Fragment } from 'react'
import { useHistory } from "react-router-dom"
import { v4 as uuid } from "uuid";

import { Grid, Container, Text, Flex, Icon, Button } from "@chakra-ui/react"

import WorksheetCard from "../components/WorksheetCard";

import { HiDocumentAdd } from "react-icons/hi";
import useBodyBackground from '../hooks/useBodyBackground';
import Navbar from '../components/Navbar';
import useDocumentTitle from '../hooks/useDocumentTitle';

function request({ url, method, body }) {
    return fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
}

const Home = () => {
    const history = useHistory();

    const [worksheets, setWorksheets] = useState([]);

    useEffect(() => {
        async function getWorksheets() {
            const response = await request({ url: "http://localhost:3001/worksheets", method: "GET" });
            const data = await response.json();
            console.log(data);
            return data;
        }
        getWorksheets().then((worksheets) => {
            setWorksheets(worksheets);
        })
    }, [])

    async function handleCreateWorksheet() {
        const body = {
            id: uuid(),
            title: "",
            content: JSON.stringify([{
                type: 'paragraph',
                children: [{ text: '' }],
            }]),
            createdAt: new Date()
        }
        try {
            //Create a record in the fake db
            const response = await request({
                url: "http://localhost:3001/worksheets", method: "POST", body
            })
            if (!response.ok) throw Error("Algo salió mal :(")

            const record = await response.json();
            //Redirect to the form page with the id of the record created
            history.push(`/worksheets/${record.id}/edit`);
        } catch (err) {
            alert(err);
        }
    }

    async function handleDeleteWorksheet(id) {
        try {

            //Create a record in the fake db
            const response = await request({
                url: `http://localhost:3001/worksheets/${id}`, method: "DELETE"
            })
            if (!response.ok) throw Error("Algo salió mal :(")

            //if the worksheet was successfully deleted, update the state 
            setWorksheets(prevWorksheets => (
                prevWorksheets.filter(
                    worksheet => worksheet.id !== id
                )
            ));

        } catch (err) {
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
