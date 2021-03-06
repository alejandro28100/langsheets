import React, { useState } from 'react'
import { Box, FormControl, FormLabel, Grid, Image, Input, Button, Stack, Alert, AlertIcon, Text } from "@chakra-ui/react";
import Logo from '../components/Logo';
import { useUser } from '../context/UserContext';
import { useHistory } from 'react-router';

const initialValue = {
    name: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
    error: undefined
}

const SignUp = () => {
    const { login, signUp, loading } = useUser();
    const history = useHistory();
    const [form, setForm] = useState(initialValue);

    const { name, lastName, email, password, password2, error } = form;

    function changeFormProp(prop, value) {
        const updatedForm = { ...form };
        updatedForm[prop] = value;
        setForm(updatedForm);
    }

    async function handleSubmit(e) {
        // Clean screen from previous errors
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

        await signUp(form.name, form.lastName, form.email, form.password);
        await login(form.email, form.password);

        //redirect to dashboard
        history.push("/dashboard");
    }

    return (
        <Grid h="100vh" placeItems="center" templateColumns={["1fr", "repeat(2, 1fr)"]} w="100vw">
            <Box>
                <Image src="/Online_collaboration.png" />
                <Text px="4" textAlign="center" fontSize="x-large" fontWeight="semibold" color="brand.700">
                    Lleva la interacción de tus clases al siguiente nivel
                </Text>
            </Box>
            <Box w="md" textAlign="center" px="10">



                <form onSubmit={handleSubmit}>
                    <Stack spacing="4">

                        <Logo />

                        <FormControl isRequired mr="4">
                            <FormLabel>Nombre (s)</FormLabel>
                            <Input autoFocus value={name} onChange={e => changeFormProp("name", e.target.value)} placeholder="Armando" />
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

                        <Button isLoading={loading} type="submit" colorScheme="brand" variant="solid">
                            Crear Cuenta
                        </Button>

                        <Text textAlign="center">¿Ya tienes una cuenta? Inicia sesión <Text color="brand" textDecoration="underline" as="a" href="/login"> aquí </Text></Text>

                    </Stack>

                </form>

            </Box>
        </Grid>
    )
}

export default SignUp
