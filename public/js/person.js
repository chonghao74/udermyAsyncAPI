
console.log("get personjs");
const divSelector = document.querySelector('div.div-block');
const divSelectorlab = document.querySelector('main label');


function clearAllChildNodes(clearContainor) {
    while (divSelector.lastChild) {
        divSelector.lastChild.remove();
    }

    // while (divSelector.firstChild) {
    //     divSelector.firstChild.remove();
    // }

}