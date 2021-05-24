export function isFullscreen() {
    return (
        document.fullscreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen ||
        document.msFullscreenElement);
};

export function parseWorksheets(worksheets) {
    return worksheets.map(worksheet => {
        worksheet.content = JSON.parse(worksheet.content);
        return worksheet;
    })
}