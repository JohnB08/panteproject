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
let userArray: userWeightObject[] = existingArray
  ? JSON.parse(existingArray)
  : [];
let winnerBracket: userWeightObject[] = [];
let activeElements: HTMLElement[] = [];

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
const makeElements = <Type extends keyof HTMLElementTagNameMap>(
  type: Type,
  attributes: Record<string, string>
): HTMLElementTagNameMap[Type] => {
  const element = document.createElement(type);
  Object.entries(attributes).forEach((attribute) => {
    const [attributeName, attributeValue] = attribute;
    element.setAttribute(attributeName, attributeValue);
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
const displayBtn = makeElements("button", { class: "displayBtn" });
displayBtn.textContent = "Display current names.";
const runBtn = makeElements("button", {
  class: "runBtn",
});
runBtn.textContent = "Run sim";
const outputField = makeElements("div", { class: "outputField" });
inputContainer.append(inputLabel, input, subBtn);
btnContainer.append(saveBtn, clearBtn, displayBtn, runBtn);
mainContainer.append(inputContainer, btnContainer, outputField);
document.body.append(mainContainer);

/**
 * viser alle brukerene i et array med deres gjeldene weight
 * @param array
 */
const displayUsers = (array: userWeightObject[]) => {
  activeElements.forEach((element) => {
    element.remove();
  });
  array.forEach((element) => {
    const displayName = makeElements("h3", { class: "outputText" });
    displayName.textContent = `${element.name}. Current Weight: ${element.currentWeight} (Lower is better)`;
    outputField.append(displayName);
    activeElements.push(displayName);
  });
};

/**
 * lager et random tall mellom 1 og 100
 * @returns
 */
const randomNumber = () => {
  const number = Math.ceil(Math.random() * 100);
  return number;
};

/**
 * Randomiserer hvor folk er i et array.
 * @param array
 * @returns
 */
const shuffleArray = (array: userWeightObject[]) => {
  let shuffledArray = array.map((x) => x);
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const randIndex = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[randIndex]] = [
      shuffledArray[randIndex],
      shuffledArray[i],
    ];
  }
  return shuffledArray;
};

/**
 * velger to random pantere fra arrayet, delvis basert på vanskelighets"vekt"
 * @param array
 */
const pickPanter = (array: userWeightObject[], number: number) => {
  const randomizedArray = shuffleArray(array);
  randomizedArray.forEach((user) => {
    if (user.currentWeight > number) {
      if (user.currentWeight > 10) {
        user.currentWeight -= 1;
      }
      winnerBracket.push(user);
      randomizedArray.splice(randomizedArray.indexOf(user), 1);
    } else {
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
const saveArray = (array: userWeightObject[]) => {
  const userArrayString = JSON.stringify(array);
  localStorage.setItem("userPanteArray", userArrayString);
};

/**
 * Clearer localStorage for pante arrayet
 */
const clearLocalStorage = () => {
  localStorage.removeItem("userPanteArray");
  window.location.reload();
};

/**
 * Adder en ny potensiell panter via panter constructor
 * @param name navnet på panteren
 * @param weight start"vekt" (hvor vanskelig er det å bli valgt)
 */
const makeUser = (name: string, weight: number = 50) => {
  const userObject: userWeightObject = new panter(name, weight);
  userArray.push(userObject);
};
subBtn.addEventListener("click", () => {
  makeUser(input.value);
  input.value = "";
});

saveBtn.addEventListener("click", () => saveArray(userArray));

clearBtn.addEventListener("click", clearLocalStorage);

displayBtn.addEventListener("click", () => displayUsers(userArray));

runBtn.addEventListener("click", () => {
  winnerBracket = [];
  pickPanter(userArray, randomNumber());
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    makeUser(input.value);
    input.value = "";
  }
});
