export function getWorksheet(id) {
    try {
        //get worksheets from localStorage API
        const worksheets = JSON.parse(localStorage.getItem("worksheets"));
        //get the chosen worksheet
        let chosenWorksheet = worksheets.find(worksheet => worksheet.id === id);
        //turn the content into valid JSON
        chosenWorksheet.content = JSON.parse(chosenWorksheet.content);
        return chosenWorksheet;
    } catch (err) {
        //show error in case the user disabled localstorage
        alert(err)
    }
}
