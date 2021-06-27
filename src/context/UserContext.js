import { createContext, useContext, useEffect, useReducer } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie"

const UserContext = createContext();

const initialValue = {
    user: undefined,
    error: undefined,
    loading: true
}

function reducer(state, action) {
    switch (action.type) {
        case 'logout':
            return {
                ...state,
                user: undefined
            }
        case 'loading':
            return {
                ...state,
                loading: true,
                error: undefined,
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
    const history = useHistory();
    useEffect(() => {
        async function getUserInfo() {
            dispatch({ type: "loading" });
            const token = Cookies.get("token");
            if (!token) {
                dispatch({ type: "success", payload: { user: undefined } });
                return
            }
            try {
                const response = await fetch("/api/users/userInfo");
                const json = await response.json();
                dispatch({ type: 'success', payload: { user: json } });
            } catch (error) {
                dispatch({ type: 'error', payload: { error } });
            }
        }

        getUserInfo();

    }, [])

    function logout() {
        Cookies.remove("token");
        dispatch({ type: "logout" });
        history.push("/")
    }

    async function login(email, password) {
        dispatch({ type: "loading" });
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

        if (response.ok) {
            //save token in a cookie
            Cookies.set("token", json.token);

            delete json.token;
            dispatch({ type: 'success', payload: { user: json } });
            return json;
        }
        dispatch({ type: 'error', payload: { error: json } });
        return undefined;
    }

    async function signUp(name, lastName, email, password) {
        dispatch({ type: "loading" });
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
        if (response.ok) {
            dispatch({ type: "success", payload: { user: {} } });
            return;
        }
        dispatch({ type: "error", payload: { error: json } });
    }

    const value = {
        logout,
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