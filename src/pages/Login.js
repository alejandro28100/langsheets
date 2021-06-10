import React, { useState } from 'react'

import { useUser } from '../context/UserContext';
import { useHistory } from 'react-router';

import Logo from '../components/Logo';
import { Box, FormControl, FormLabel, Input, Button, Stack, Alert, AlertIcon, Text } from "@chakra-ui/react";

const initialValue = {
    email: "",
    password: "",
}

function Login() {
    const history = useHistory();
    const [form, setForm] = useState(initialValue);
    const { email, password } = form;
    const { login, loading, error } = useUser();

    function changeFormProp(prop, value) {
        const updatedForm = { ...form };
        updatedForm[prop] = value;
        setForm(updatedForm);
    }

    async function handleSubmit(e) {

        e.preventDefault();

        const [loggedIn] = await login(form.email, form.password);

        if (loggedIn) {
            history.push("/");
        }

    }

    return (
        <Box as="form" bg="gray.100" onSubmit={handleSubmit} display="flex" alignItems="center" justifyContent="center" h="100vh" flexDirection="column">

            <Stack spacing="8" bg="white" shadow="base" w={["80vw", "50vw", "40vw"]} p={["8", "10"]}>
                <Logo />

                <FormControl isRequired>
                    <FormLabel>Correo</FormLabel>
                    <Input autoFocus value={email} onChange={e => changeFormProp("email", e.target.value)} placeholder="email@provider.com" />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Contraseña</FormLabel>
                    <Input value={password} onChange={e => changeFormProp("password", e.target.value)} placeholder="password" type="password" />
                </FormControl>

                {
                    error && (
                        <Alert status="error">
                            <AlertIcon />
                            {error.message}
                        </Alert>
                    )
                }

                <Button isLoading={loading} type="submit" colorScheme="brand" variant="solid">
                    Iniciar Sesión
            </Button>

                <Text textAlign="center">¿Aun no tienes una cuenta? Crea tu cuenta <Text color="brand" textDecoration="underline" as="a" href="/signUp"> aquí </Text></Text>

            </Stack>

        </Box>
    )
}

export default Login
