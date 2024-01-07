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
/**
 * viser alle brukerene i et array med deres gjeldene weight
 * @param array
 */
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
/**
 * lager et random tall mellom 1 og 100
 * @returns
 */
var randomNumber = function () {
    var number = Math.ceil(Math.random() * 100);
    return number;
};
/**
 * Randomiserer hvor folk er i et array.
 * @param array
 * @returns
 */
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
/**
 * velger to random pantere fra arrayet, delvis basert på vanskelighets"vekt"
 * @param array
 */
var pickPanter = function (array, number) {
    var randomizedArray = shuffleArray(array);
    randomizedArray.forEach(function (user) {
        if (user.currentWeight > number) {
            if (user.currentWeight > 10) {
                user.currentWeight -= 1;
            }
            winnerBracket.push(user);
            randomizedArray.splice(randomizedArray.indexOf(user), 1);
        }
        else {
            if (user.currentWeight < 90) {
                user.currentWeight += 1;
            }
        }
        if (winnerBracket.length === 2) {
            displayUsers(winnerBracket);
            userArray = randomizedArray.concat(winnerBracket);
            saveArray(userArray);
            return;
        }
    });
    if (winnerBracket.length < 2 || winnerBracket.length > 2) {
        userArray = randomizedArray.concat(winnerBracket);
        winnerBracket = [];
        pickPanter(userArray, randomNumber());
    }
};
/**
 * Lagrer arrayet med oppdaterte stats til localStorage
 * @param array
 */
var saveArray = function (array) {
    var userArrayString = JSON.stringify(array);
    localStorage.setItem("userPanteArray", userArrayString);
};
/**
 * Clearer localStorage for pante arrayet
 */
var clearLocalStorage = function () {
    localStorage.removeItem("userPanteArray");
    window.location.reload();
};
/**
 * Adder en ny potensiell panter via panter constructor
 * @param name navnet på panteren
 * @param weight start"vekt" (hvor vanskelig er det å bli valgt)
 */
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
    pickPanter(userArray, randomNumber());
});
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        makeUser(input.value);
        input.value = "";
    }
});
