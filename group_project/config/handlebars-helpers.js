/*************************************************************
**  Description: handlebars helper functions
**************************************************************/

module.exports = {
    bar: () => {
        console.log('BAR!')
        return "BAR!";
    },
    findChecked: function findProgrammersChecked(inputId, bug) {
        for (let i in bug.programmers) {
            if (inputId == bug.programmers.programmerId) {
                document.getElementById("myCheck").checked = true;
            }
        }
    }
}
