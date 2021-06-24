import { Node, Transforms } from "slate";
import { ReactEditor } from "slate-react";

function createExercise(editor, { type }) {

    const newNode = {
        type: 'exercise-block',
        exerciseType: type,
        children: [{
            type: 'paragraph',
            children: [{
                text: ''
            }]
        }]
    }

    if (editor.selection) {
        const [node] = Node.fragment(editor, editor.selection);
        //Prevent the user from creating embeded exercise-block s
        if (node.type === "exercise-block") {
            alert("No es posible crear un ejercicio dentro de otro ejercicio, selecciona una linea de texto vacía fuera del cuadro de ejercicio");
            return;
        }
    }

    Transforms.insertNodes(editor, newNode, { select: true });
    ReactEditor.focus(editor);

}

export {
    createExercise,
}