import { useMediaQuery } from "@chakra-ui/media-query";

import { Box } from "@chakra-ui/layout";

const MissingWordEditable = props => {

    const [isPrinting] = useMediaQuery(["print"])

    //If printing preview is active duplicate the content of the element using the text property of leaf 
    //so the missing word space in the printing view is larger
    //In normal mode use the children property to render the text in the leaf
    const children = isPrinting
        ? props.leaf.text + props.leaf.text
        : props.children;

    return (
        <Box as="span"
            color={isPrinting ? "transparent" : ""}
            borderRadius="sm"
            px="1"
            background="brand.200"
            {...props.attributes}
            sx={{
                "@media print": {
                    background: "none",
                    borderBottom: "solid black 1px",
                    color: "transparent",
                }
            }}
        >
            {children}
        </Box>
    )
}

export default MissingWordEditable;