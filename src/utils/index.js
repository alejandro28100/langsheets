import { Node, Text } from "slate";
import { jsx } from "slate-hyperscript";


//receives an slate fragment and returns a string
export function serializeSlateContent(value = []) {

    if (value.length >= 1) {
        return value.map(node => serializeNode(node)).join("");
    }
    throw new Error("Value expects a root node");
}

//receives a single slate node and returns a string
function serializeNode(node) {
    if (Text.isText(node)) {
        let string = Node.string(node);
        if (node.bold) {
            string = `<b>${string}</b>`
        }
        if (node.underline) {
            string = `<u>${string}</u>`
        }
        if (node.italic) {
            string = `<em>${string}</em>`
        }
        if (node.missingWord) {
            string = `<span class="missingWord=true">${string}</span>`
        }
        return string;
    }

    const children = node.children.map(n => serializeNode(n)).join("");

    switch (node.type) {
        case "paragraph":
            return `<p>${children}</p>`

        default:
            return children
    }
}

//receives a string and returns a slate fragment 
export function deserializeSlateContent(string) {
    const document = new DOMParser().parseFromString(string, "text/html");
    return deserializeElement(document.body);
}

export function deserializeElement(el) {

    if (el.nodeType === 3) {
        return el.textContent;
    } else if (el.nodeType !== 1) {
        return null;
    }

    let children = Array.from(el.childNodes).map(deserializeElement);

    if (children.length === 0) {
        children = [{ text: "" }];
    }


    switch (el.nodeName) {

        case 'BODY':
            return jsx('fragment', {}, children)
        case 'BR':
            return '\n'
        case 'BLOCKQUOTE':
            return jsx('element', { type: 'quote' }, children)
        case 'P':
            return jsx('element', { type: 'paragraph' }, children)
        case 'A':
            return jsx(
                'element',
                { type: 'link', url: el.getAttribute('href') },
                children
            )
        case "SPAN":
            const marksObj = {};
            Array.from(el.classList).forEach(mark => {

                const [key, value] = mark.split("=");
                const processedValue = value === "true" ? true : value;
                marksObj[key] = processedValue;
            });
            return jsx("text", { ...marksObj }, children)
        case "B":
            return jsx("text", { bold: true }, children);
        case "U":
            return jsx("text", { underline: true }, children);
        case "EM":
            return jsx("text", { italic: true }, children);
        default:
            return el.textContent
    }

}