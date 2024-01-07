interface userWeightObject {
  name: string;
  baseWeight: number;
  currentWeight: number;
}

class panter {
  name: string;
  baseWeight: number;
  currentWeight: number;
  constructor(name: string, weight: number) {
    this.name = name;
    this.baseWeight = weight;
    this.currentWeight = weight;
  }
}
let existingArray = localStorage.getItem("userPanteArray");
let userArray: Object[] = existingArray ? JSON.parse(existingArray) : [];

const makeUser = (name: string, weight: number = 50) => {
  const userObject: userWeightObject = new panter(name, weight);
  userArray.push(userObject);
};

const makeElements = (type: string, properties: Object) => {
  const element: HTMLElement = document.createElement(type);
  Object.entries(properties).forEach((property) => {
    const [propertyName, propertyValue] = property;
    element.setAttribute(propertyName, propertyValue);
  });
  return element;
};
const mainContainer = makeElements("div", { class: "mainContainer" });
const inputContainer = makeElements("div", { class: "inputContainer" });
const input = makeElements("input", {
  type: "text",
  class: "nameInput",
  id: "nameInput",
  placeholder: "Ola Nordmann...",
});
const inputLabel = makeElements("label", {
  for: "nameInput",
});
inputLabel.textContent = "Add a name";
const subBtn = makeElements("button", {
  class: "subBtn",
});
subBtn.textContent = "Submit!";
const btnContainer = makeElements("div", { class: "btnContainer" });
const saveBtn = makeElements("button", {
  class: "saveBtn",
});
saveBtn.textContent = "Save!";
const clearBtn = makeElements("button", {
  class: "clearBtn",
});
clearBtn.textContent = "Clear saved list!";
const runBtn = makeElements("button", {
  class: "runBtn",
});
runBtn.textContent = "Run sim";
const outputField = makeElements("div", { class: "outputField" });
inputContainer.append(inputLabel, input, subBtn);
btnContainer.append(saveBtn, clearBtn, runBtn);
mainContainer.append(inputContainer, btnContainer, outputField);
document.body.append(mainContainer);

const saveArray = () => {
  const userArrayString = JSON.stringify(userArray);
  localStorage.setItem("userPanteArray", userArrayString);
};
const clearLocalStorage = () => {
  localStorage.removeItem("userPanteArray");
};

saveBtn.addEventListener("click", saveArray);

clearBtn.addEventListener("click", clearLocalStorage);
