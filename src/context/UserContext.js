import { createContext, useContext, useEffect, useReducer } from "react";
import Cookies from "js-cookie"

const UserContext = createContext();

const initialValue = {
    user: undefined,
    error: undefined,
    loading: false
}

function reducer(state, action) {
    switch (action.type) {
        case 'loading':
            return {
                ...state,
                loading: true,
            }
        case 'success':
            const { user } = action.payload;
            return {
                ...state,
                user,
                loading: false
            }
        case 'error':
            const { error } = action.payload;
            return {
                ...state,
                user: undefined,
                loading: false,
                error
            }
        default:
            break;
    }
}

export const UserProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialValue);

    // useEffect(() => {
    //     async function getUserInfo() {
    //         dispatch({ type: 'loading' });
    //         try {
    //             const response = await fetch("/api/users/userInfo");
    //             const json = await response.json();
    //             dispatch({ type: 'success', payload: { user: json } });
    //         } catch (error) {
    //             dispatch({ type: 'error', payload: { error } });
    //         }
    //     }

    //     getUserInfo();


    // }, [])

    async function login(email, password) {
        //Login User 
        dispatch({ type: 'loading' });
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

        if (response.ok) {
            //save token in a cookie
            Cookies.set("token", json.token);

            delete json.token;
            dispatch({ type: 'success', payload: { user: json } });
            return [true, json];
        }
        dispatch({ type: 'error', payload: { error: json } });
        return [false, undefined];
    }

    async function signUp(name, lastName, email, password) {
        //Create User Record
        dispatch({ type: 'loading' });
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
        if (response.ok) {
            dispatch({ type: "success", payload: { user: {} } });
            return;
        }
        dispatch({ type: "error", payload: { error: json } });
    }

    const value = {
        login,
        signUp,
        ...state
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext);
}