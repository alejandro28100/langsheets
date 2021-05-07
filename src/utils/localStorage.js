export function getWorksheet(id) {
    try {
        //get worksheets from localStorage API
        const worksheets = localStorage.getItem("worksheets")
        //get the chosen worksheet
        let chosenWorksheet = JSON.parse(worksheets).find(worksheet => worksheet.id === id);
        if (!chosenWorksheet) return { worksheet: undefined, error: "La actividad que solicito no existe" };
        //turn the content into valid JSON
        chosenWorksheet.content = JSON.parse(chosenWorksheet.content);
        return { worksheet: chosenWorksheet, error: undefined };
    } catch (err) {
        //show error
        return { error: err };
    }
}
