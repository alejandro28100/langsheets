export function isFullscreen() {
    return (
        document.fullscreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen ||
        document.msFullscreenElement);
};

export function parseWorksheets(worksheets) {
    return worksheets.map(parseWorksheet);
}

export function stringifyWorkshet(worksheet) {
    const updatedWorksheet = { ...worksheet };
    updatedWorksheet.content = JSON.stringify(worksheet.content);
    return updatedWorksheet;
}

export function parseWorksheet(worksheet) {
    const updatedWorksheet = { ...worksheet };
    updatedWorksheet.content = JSON.parse(worksheet.content);
    return updatedWorksheet;
}

export function createQueryString(params) {
    if (Object.keys(params).length === 0) return "";
    return Object.keys(params)
        .map(key => {
            const value = params[key];
            if (!!value) {
                return `${key}=${params[key]}`;
            }
            return ""
        })
        .join("&");
}