// @refresh reset
import React, { Fragment, useEffect, useRef, useReducer } from 'react'
import { useParams } from "react-router-dom"

import { Slate, Editable } from "slate-react"

import { Container, Box, Text, Input, Flex, Button, useToast, Avatar, AvatarGroup } from "@chakra-ui/react";
// import Navbar from "../components/Navbar";


import useBodyBackground from '../hooks/useBodyBackground';
import useSlateRender from '../hooks/useSlateRender';
import useSlateEditor from '../hooks/useSlateEditor';
import { useUser } from "../context/UserContext";
import useDocumentTitle from '../hooks/useDocumentTitle';
import { parseWorksheet } from '../utils';

import { SocketContext, socket } from "../context/socket";
import { Transforms } from 'slate';
// import Logo from '../components/Logo';
import { FaUserAlt } from 'react-icons/fa';
// import { HiPhoneIncoming } from 'react-icons/hi';

const initialValue = {
    users: [],
    username: undefined,
    worksheet: {
        title: "",
        content: [
            {
                type: "paragraph",
                children: [
                    {
                        text: ""
                    }
                ]
            }
        ]
    }
};

function reducer(state, action) {
    // console.log(`> Practice reducer: ${action.type}`);
    switch (action.type) {
        case 'set-username':
            return {
                ...state,
                username: action.payload.username
            }
        case 'set-worksheet':
            return {
                ...state,
                worksheet: action.payload.worksheet
            }
        case 'set-worksheet-content':
            return {
                ...state,
                worksheet: {
                    ...state.worksheet,
                    content: action.payload.content
                }
            }
        case 'add-user':
            return {
                ...state,
                users: [
                    ...state.users,
                    action.payload.user
                ]
            }
        case 'set-users':
            return {
                ...state,
                users: action.payload.users
            }
        default:
            console.warn("Action provided did not matched", action);
            return state;
    }
}


const Practice = () => {
    //Get the id of the worksheet from the url 
    const { id } = useParams();
    const { user, loading } = useUser();
    const editor = useSlateEditor();

    const [renderLeaf, renderElement] = useSlateRender();

    const [state, dispatch] = useReducer(reducer, initialValue);
    const { username, users, worksheet } = state;

    const toast = useToast();

    useEffect(() => {
        async function getWorksheet() {
            const response = await fetch(`/api/activities/${id}`);
            const json = await response.json();

            if (response.ok) {
                const worksheet = parseWorksheet(json);
                dispatch({ type: 'set-worksheet', payload: { worksheet } });
            }

        }
        getWorksheet();
    }, [id])

    useEffect(() => {
        //Get username from localStorage (Only for students)
        let username = localStorage.getItem("ls-username");

        //Get username from user hook (Only for Teachers)
        if (!loading && user) {
            username = `${user.name} ${user.lastName}`;
        }

        dispatch({ type: "set-username", payload: { username } })
    }, [loading])

    useEffect(() => {
        if (username) {
            socket.auth = { username };
            socket.connect();
            socket.emit('join-room', id);
        }

    }, [id, username])

    useEffect(() => {

        // socket.onAny((event, ...args) => {
        //     console.log(event, args);
        // });

        socket.on('users', (commingUsers) => {
            dispatch({ type: 'set-users', payload: { users: commingUsers } });
        });

        socket.on("user-connected", (newUser) => {
            toast({
                description: `${newUser.username} ha ingresado a la actividad.`,
                status: "info",
                duration: 3000,
                position: "top-right",
                isClosable: true,
            })
            dispatch({ type: 'add-user', payload: { user: newUser } });
        });

        //Send the updated contend to a new user 
        socket.on("send-updated-content", (userID) => {
            // console.log(worksheet.content);
            socket.emit('send-updated-content', userID, worksheet.content);
        });

        socket.on("user-disconnected", ({ username, users }) => {
            toast({
                description: `${username} ha salido de la actividad.`,
                status: "info",
                duration: 3000,
                position: "top-right",
                isClosable: true,
            })
            dispatch({ type: 'set-users', payload: { users } });
        });

        socket.on('action', (value) => {
            if (editor.children.length === 0) return;
            const { path, ...action } = value;

            switch (action.type) {
                case 'update-content':
                    console.log(action.content);
                    dispatch({ type: 'set-worksheet-content', payload: { content: action.content } })
                    break;
                case 'set-leaf-props':
                    Transforms.setNodes(editor, {
                        ...action.props
                    }, { at: path });
                    break;
                case 'input-focused':
                    Transforms.setNodes(editor, {
                        focused: true,
                        user: action.user
                    }, { at: path });
                    break;
                case 'input-blured':
                    Transforms.setNodes(editor, {
                        focused: false
                    }, { at: path });
                    break;
                default:
                    break;
            }
        });

        socket.on('connection_error', (err) => {
            // console.error(err);
            switch (err.message) {
                case "invalid username":
                    toast({
                        description: "Debes elegir un nombre válido",
                        status: "warning",
                        duration: 8000,
                        position: "top-right",
                        isClosable: true,
                    })
                    break;
                case "invalid room":
                    socket.emit("join-room", id)
                    break;
                default:
                    break;
            }
        })

        return () => {
            socket.offAny();
            socket.off("send-updated-content");
            socket.off('users');
            socket.off('user-connected');
            socket.off('user-disconnected');
            socket.off('action');
            socket.off('connection_error');
        }
    }, [id, worksheet, editor, toast])

    //Set a custom background color
    useBodyBackground("var(--chakra-colors-gray-100)");
    useDocumentTitle(`LangSheets | ${worksheet.title}`);
    return (
        <SocketContext.Provider value={socket}>
            {
                !loading && user
                    ? <TeacherView
                        {...{
                            users,
                            worksheet,
                            dispatch,
                            editor,
                            renderLeaf,
                            renderElement,
                            activityID: id
                        }}
                    />
                    : <StudentView
                        {...{
                            username,
                            users,
                            worksheet,
                            dispatch,
                            editor,
                            renderLeaf,
                            renderElement,
                            activityID: id
                        }}
                    />
            }
        </SocketContext.Provider>
    )
}



const UserNameForm = (props) => {
    const { dispatch } = props;

    const toast = useToast();
    const inputRef = useRef();

    function handleSetUserName() {
        const username = inputRef.current.value;
        if (username.trim() !== "") {
            localStorage.setItem("ls-username", username);
            dispatch({ type: 'set-username', payload: { username } })
            return
        }

        toast({
            description: "Debes elegir un nombre válido",
            status: "warning",
            duration: 8000,
            position: "top-right",
            isClosable: true,
        })

    }

    return (
        <Flex bg="gray.100" h="100vh" alignItems="center" justifyContent="center">
            <Flex flexDir="column" bg="white" px="10" py="5" boxShadow="base" borderRadius="base" alignItems="center" justifyContent="center">
                <Text fontSize="x-large" my="4">Ingresa tu nombre</Text>
                <Input onSubmit={handleSetUserName} size="lg" ref={inputRef} variant="filled" my="4" placeholder="Escribe un nombre" />
                <Button variant="solid" colorScheme="brand" my="4" onClick={handleSetUserName}>Aceptar</Button>
            </Flex>
        </Flex>
    )
};

const TeacherView = (props) => {
    const { users, worksheet, dispatch, editor, renderLeaf, renderElement } = props;
    return (
        <Fragment>

            <Flex py="2" >
                <Text flexGrow="1" color="brand.600" px="4" fontSize="x-large" fontWeight="bold" >{worksheet.title}</Text>
                <Flex justifyContent="flex-end" alignItems="center" px="4">
                    <UsersList users={users} />
                </Flex>
            </Flex>

            <Box >
                <Container maxWidth="container.lg" my="4" >
                    <SocketContext.Provider value={socket}>
                        <Slate
                            {...{
                                editor,
                                value: worksheet.content,
                                onChange: (newContent) => dispatch({ type: 'set-worksheet-content', payload: { content: newContent } })
                            }}
                        >
                            <Box background="white" px={["8", "16"]} py="16" as={Editable} shadow="sm"
                                {...{ renderElement, renderLeaf, readOnly: true }}
                            />
                        </Slate>
                    </SocketContext.Provider>
                </Container>
            </Box >
        </Fragment>
    )
}

const StudentView = (props) => {
    const { username, users, worksheet, dispatch, editor, renderLeaf, renderElement } = props;
    return (
        username ? (
            <Fragment>

                <Flex py="2" >
                    <Text flexGrow="1" color="brand.600" px="4" fontSize="x-large" fontWeight="bold" >{worksheet.title}</Text>
                    <Flex justifyContent="flex-end" alignItems="center" px="4">
                        <UsersList users={users} />
                    </Flex>
                </Flex>

                <Box >
                    <Container maxWidth="container.lg" my="4" >
                        <SocketContext.Provider value={socket}>
                            <Slate
                                {...{
                                    editor,
                                    value: worksheet.content,
                                    onChange: (newContent) => dispatch({ type: 'set-worksheet-content', payload: { content: newContent } })
                                }}
                            >
                                <Box background="white" px={["8", "16"]} py="16" as={Editable} shadow="sm"
                                    {...{ renderElement, renderLeaf, readOnly: true }}
                                />
                            </Slate>
                        </SocketContext.Provider>
                    </Container>
                </Box >
            </Fragment>
        ) : (
            <UserNameForm {...{ dispatch }} />
        )
    )
}


const UsersList = ({ users }) => (
    <AvatarGroup size="sm" max={3}>
        {users.map(({ username, userID }) => (
            <Avatar key={userID} bg="brand.500" color="white" name={username} src={<FaUserAlt />} title={username} />
        ))}
    </AvatarGroup>
)
export default Practice
