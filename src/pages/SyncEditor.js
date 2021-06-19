// @refresh reset
import { Box } from '@chakra-ui/react';
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { Editor } from 'slate';
import { Slate, Editable } from 'slate-react';
import { socket } from '../context/socket';

import useSlateEditor from '../hooks/useSlateEditor';
import useSlateRender from '../hooks/useSlateRender';

const initialValue = {
    editorValue: [{
        type: 'paragraph',
        children: [{ text: "Hello World!" }]
    }],
    remoteChange: false,
};

function reducer(state, action) {
    const { type } = action;
    switch (type) {
        case 'set_editor_value':
            const { editorValue } = action.payload;
            return {
                ...state,
                editorValue
            }
        default:
            return state;
    }
}

function SyncEditor() {

    const [state, dispatch] = useReducer(reducer, initialValue);

    const { editorValue } = state;

    const socketChange = useRef(false);

    const editor = useSlateEditor();

    //Using date as a provitional id;
    const id = useRef(Date.now().toString());

    const [renderLeaf, renderElement] = useSlateRender();

    socket.connect()
    useEffect(() => {

        socket.on('content change', ({ id: senderID, operations }) => {

            // if (id.current !== senderID) {

            console.log("Operations received", { senderID, operations });
            console.log("Remote change status in socket", socketChange.current);

            socketChange.current = true;

            Editor.withoutNormalizing(editor, () => {
                operations.forEach(operation => {
                    editor.apply(operation);
                })
            })

            // }
        })

        return () => {
            socket.off("content change")
            if (socket.connected) {
                socket.disconnect()
            }
        }
    }, [])

    return (
        <Slate {...{
            editor,
            value: editorValue,
            onChange: (newValue) => {
                console.log("Content updated", newValue);
                dispatch({ type: 'set_editor_value', payload: { editorValue: newValue } })
                const operations = editor.operations
                    .filter(operation => !["set_value", "set_selection"].includes(operation.type))

                console.log("Remote change", socketChange.current);

                if (socketChange.current) {
                    console.log("Change happened in other editor")
                } else {
                    console.log("Change happened in this editor")
                    if (operations.length) {
                        console.log("Sending changes to the server");
                        socket.emit('content change', { id: id.current, operations });
                    }
                }

                socketChange.current = false;
            }
        }}>
            <Box border="purple 1px solid">
                <Editable {...{ renderElement, renderLeaf }} />
            </Box>
        </Slate>
    )
}

export default SyncEditor
