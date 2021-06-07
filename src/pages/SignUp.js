import React, { useReducer, useState } from 'react'
import { Box, Flex, FormControl, FormLabel, Grid, Image, Input, Button, Stack, Alert, AlertIcon } from "@chakra-ui/react";
import Logo from '../components/Logo';

const initialValue = {
    name: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
    error: undefined
}

const SignUp = () => {

    const [form, setForm] = useState(initialValue);

    const { name, lastName, email, password, password2, error } = form;

    function changeFormProp(prop, value) {
        const updatedForm = { ...form };
        updatedForm[prop] = value;
        setForm(updatedForm);
    }

    async function handleSubmit(e) {
        //Clean screen from previous errors
        // const updatedForm = { ...form };
        // updatedForm.error = undefined;
        // setForm(updatedForm);

        e.preventDefault();

        //Prevent user to pass two different passwords
        if (form.password !== form.password2) {
            const updatedForm = { ...form };
            updatedForm.password2 = "";
            updatedForm.error = "Las contraseñas no coinciden";
            setForm(updatedForm);
            return;
        }

        await createUserRecord(form.name, form.lastName, form.email, form.password);

        const { token } = await loginUser(form.email, form.password);

        document.cookie = `token=${token}`;

    }


    async function createUserRecord(name, lastName, email, password) {
        //Create User Record
        const response = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                lastName,
                email,
                password
            })
        })

        const json = await response.json();

        return {
            email: json.email,
            password: json.password
        };

    }

    async function loginUser(email, password) {
        //Login User 
        const response = await fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })

        const json = await response.json();

        return {
            token: json.token
        }
    }
    return (
        <Grid h="100vh" placeItems="center" templateColumns={["1fr", "repeat(2, 1fr)"]} w="100vw">
            <Image src="/Online_collaboration.png" />
            <Box w="md" textAlign="center" px="10">

                <Logo />

                <form onSubmit={handleSubmit}>
                    <Stack spacing="4">

                        <FormControl isRequired mr="4">
                            <FormLabel>Nombre (s)</FormLabel>
                            <Input value={name} onChange={e => changeFormProp("name", e.target.value)} placeholder="Armando" />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Apellido (s)</FormLabel>
                            <Input value={lastName} onChange={e => changeFormProp("lastName", e.target.value)} placeholder="Sánchez" />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Correo</FormLabel>
                            <Input value={email} onChange={e => changeFormProp("email", e.target.value)} placeholder="email@provider.com" />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Contraseña</FormLabel>
                            <Input value={password} onChange={e => changeFormProp("password", e.target.value)} type="password" />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Confirma tu contraseña</FormLabel>
                            <Input value={password2} onChange={e => changeFormProp("password2", e.target.value)} type="password" />
                        </FormControl>

                        {
                            error && (
                                <Alert status="error">
                                    <AlertIcon />
                                    {error}
                                </Alert>
                            )
                        }

                        <Button type="submit" colorScheme="brand" variant="solid">
                            Crear Cuenta
                        </Button>

                    </Stack>

                </form>

            </Box>
        </Grid>
    )
}

export default SignUp
