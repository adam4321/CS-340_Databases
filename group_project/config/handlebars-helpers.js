/*************************************************************
**  Description: handlebars helper functions
**************************************************************/

module.exports = {
    bar: () => {
        console.log('BAR!')
        return "BAR!";
    },
    findChecked: function findProgrammersChecked(inputId, bug) {
        console.log(inputId)
        console.log(bug)
        for (let i in inputId) {
            if (inputId == bug.programmers.programmerId) {
                document.getElementById("myCheck").checked = true;
            }
        }
    }
}
