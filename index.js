var panter = /** @class */ (function () {
    function panter(name, weight) {
        this.name = name;
        this.baseWeight = weight;
        this.currentWeight = weight;
    }
    return panter;
}());
var existingArray = localStorage.getItem("userPanteArray");
var userArray = existingArray
    ? JSON.parse(existingArray)
    : [];
var loserBracket = [];
var winnerBracket = [];
var activeElements = [];
/**
 * lager html element basert på hvilke element det finner i HTMLElementTagNameMap.
 * Recorder en kopi av attributes for å identifisere rett element.
 * Kan ikke sette
 * @param type html element navn
 * @param attributes object med html attributes
 * @returns
 */
/* Så hva betyr <Type extends keyof HTMLElementTagNameMap>?  De betyr at jeg lager en ny Type som er en samling av alle keys i HTMLElementTagNameMap type
Så sier jeg til funksjonen at type parameteret må passe med den nye Type. Den så prøver å se om html typen Type, også kan ha en Record av attributene attributes.
derfor sier den at parameterene som kommer inn, både typen OG attributer må passe til Type som den finner i HTMLElementTagNameMap[Type] */
var makeElements = function (type, attributes) {
    var element = document.createElement(type);
    Object.entries(attributes).forEach(function (attribute) {
        var attributeName = attribute[0], attributeValue = attribute[1];
        element.setAttribute(attributeName, attributeValue);
    });
    return element;
};
var mainContainer = makeElements("div", { class: "mainContainer" });
var inputContainer = makeElements("div", { class: "inputContainer" });
var input = makeElements("input", {
    type: "text",
    class: "nameInput",
    id: "nameInput",
    placeholder: "Ola Nordmann...",
});
var inputLabel = makeElements("label", {
    for: "nameInput",
});
inputLabel.textContent = "Add a name";
var subBtn = makeElements("button", {
    class: "subBtn",
});
subBtn.textContent = "Submit!";
var btnContainer = makeElements("div", { class: "btnContainer" });
var saveBtn = makeElements("button", {
    class: "saveBtn",
});
saveBtn.textContent = "Save!";
var clearBtn = makeElements("button", {
    class: "clearBtn",
});
clearBtn.textContent = "Clear saved list!";
var displayBtn = makeElements("button", { class: "displayBtn" });
displayBtn.textContent = "Display current names.";
var runBtn = makeElements("button", {
    class: "runBtn",
});
runBtn.textContent = "Run sim";
var outputField = makeElements("div", { class: "outputField" });
inputContainer.append(inputLabel, input, subBtn);
btnContainer.append(saveBtn, clearBtn, displayBtn, runBtn);
mainContainer.append(inputContainer, btnContainer, outputField);
document.body.append(mainContainer);
var displayUsers = function (array) {
    activeElements.forEach(function (element) {
        element.remove();
    });
    array.forEach(function (element) {
        var displayName = makeElements("h3", { class: "outputText" });
        displayName.textContent = "".concat(element.name, ". Current Weight: ").concat(element.currentWeight, " (Lower is better)");
        outputField.append(displayName);
        activeElements.push(displayName);
    });
};
var randomNumber = function () {
    var number = Math.ceil(Math.random() * 100);
    return number;
};
var shuffleArray = function (array) {
    var _a;
    var shuffledArray = array.map(function (x) { return x; });
    for (var i = shuffledArray.length - 1; i > 0; i--) {
        var randIndex = Math.floor(Math.random() * (i + 1));
        _a = [
            shuffledArray[randIndex],
            shuffledArray[i],
        ], shuffledArray[i] = _a[0], shuffledArray[randIndex] = _a[1];
    }
    return shuffledArray;
};
var pickPanter = function (array) {
    var randomizedArray = shuffleArray(array);
    console.log(randomizedArray);
    var randWeight = randomNumber();
    console.log(randWeight);
    if (randomizedArray[0].currentWeight < randWeight) {
        if (randomizedArray[0].currentWeight < 90) {
            randomizedArray[0].currentWeight += 1;
        }
        loserBracket.push(randomizedArray[0]);
        randomizedArray.shift();
    }
    if (randomizedArray.length === 2) {
        randomizedArray[0].currentWeight -= 5;
        randomizedArray[1].currentWeight -= 5;
        winnerBracket.push(randomizedArray[0], randomizedArray[1]);
        userArray = loserBracket.concat(winnerBracket);
        saveArray(userArray);
        displayUsers(randomizedArray);
    }
    else
        pickPanter(randomizedArray);
};
var saveArray = function (array) {
    var userArrayString = JSON.stringify(array);
    localStorage.setItem("userPanteArray", userArrayString);
};
var clearLocalStorage = function () {
    localStorage.removeItem("userPanteArray");
    window.location.reload();
};
var makeUser = function (name, weight) {
    if (weight === void 0) { weight = 50; }
    var userObject = new panter(name, weight);
    userArray.push(userObject);
};
subBtn.addEventListener("click", function () {
    makeUser(input.value);
    input.value = "";
});
saveBtn.addEventListener("click", function () { return saveArray(userArray); });
clearBtn.addEventListener("click", clearLocalStorage);
displayBtn.addEventListener("click", function () { return displayUsers(userArray); });
runBtn.addEventListener("click", function () {
    winnerBracket = [];
    loserBracket = [];
    pickPanter(userArray);
});
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        makeUser(input.value);
        input.value = "";
    }
});
