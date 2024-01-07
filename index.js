var user = /** @class */ (function () {
    function user(name, weight) {
        this.name = name;
        this.baseWeight = weight;
        this.currentWeight = weight;
    }
    return user;
}());
var userArray = [];
var makeUser = function (name, weight) {
    if (weight === void 0) { weight = 50; }
    var userObject = new user(name, weight);
    userArray.push(userObject);
};
var makeElements = function (type, properties) {
    var element = document.createElement(type);
    Object.entries(properties).forEach(function (property) {
        var propertyName = property[0], propertyValue = property[1];
        element.setAttribute(propertyName, propertyValue);
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
var runBtn = makeElements("button", {
    class: "runBtn",
});
runBtn.textContent = "Run sim";
var outputField = makeElements("div", { class: "outputField" });
inputContainer.append(inputLabel, input, subBtn);
btnContainer.append(saveBtn, clearBtn, runBtn);
mainContainer.append(inputContainer, btnContainer, outputField);
document.body.append(mainContainer);
