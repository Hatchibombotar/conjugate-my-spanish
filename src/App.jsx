import logo from './logo.svg';
import styles from './App.module.scss';
import { createSignal } from 'solid-js';

import verbData from "./data/verbs.json"
import tenseData from "./data/tenses.json"
const [possibleTenses, setPossibleTenses] = createSignal(Object.keys(tenseData))
const [possiblePeople, setPossiblePeople] = createSignal(["yo", "tú", "él", "nosotros", "vosotros", "ellos"])

const [currentVerb, setCurrentVerb] = createSignal(verbData[0])
const [isIrregular, setAsIrregular] = createSignal(verbData[0])

const [targetConjugation, setTargetConjugation] = createSignal({
  "tense": "present",
  "person": "yo"
})
const [userInput, setUserInput] = createSignal("")

const [correctCount, setCorrectCount] = createSignal(0)
const [totalCount, setTotalAmount] = createSignal(0)

let inputBox;

function App() {
  return (
    <div
      class={styles.App}
      onkeydown={(event) => event.key == "Enter" && confirmAnswer() }
    >
      <div class={styles.scores}>
        <h2><a class={styles.green}>{correctCount()}</a>/{totalCount()} correct</h2>
      </div>
      <div>
        <h3>{currentVerb().infinitive}</h3>
        <h5>{currentVerb().english}</h5>
        <h4>Conjugate into the <a class={styles.targetConjugation}>{targetConjugation().tense}</a> tense for the <a class={styles.targetConjugation}>{targetConjugation().person}</a> form{isIrregular() ? <a> (irregular)</a> : <a></a>}.</h4>
        <input type='text' ref={inputBox} lang='es' onInput={(event) => setUserInput(event.currentTarget.value)}></input>
        <button type='button' onclick={confirmAnswer}>Confirm</button>
      </div>
    </div>
  )
}

const randomNumber = (start, end) => Math.floor(Math.random() * (end - start + 1)) + start
function assignRandomQuestion() {
  setTargetConjugation({
    "tense": possibleTenses()[randomNumber(0, possibleTenses().length - 1)],
    "person": possiblePeople()[randomNumber(0, possiblePeople().length - 1)]
  })


  const infinitiveEnding = currentVerb().infinitive.slice(-2)
  setCurrentVerb(verbData[randomNumber(0, verbData.length - 1)])

  if (currentVerb()?.irregulars === undefined) {
    setAsIrregular(false)
    return
  }
  if (currentVerb()?.irregulars[targetConjugation().tense][targetConjugation().person] !== undefined) {
    setAsIrregular(true)
  } else {
    setAsIrregular(false)
  }
}

function conjugate(infinitive, tense, person) {
  const infinitiveRoot = infinitive.slice(0, -2)
  const infinitiveEnding = infinitive.slice(-2)
  const endingDictionary = tenseData[tense][infinitiveEnding] ?? {}
  const verbEnding = endingDictionary[person]
  const conjugateType = tenseData[tense].type


  if (conjugateType == "add") {
    return infinitive + verbEnding
  } else if (conjugateType == "swap") {
    return infinitiveRoot + verbEnding
  } else if (conjugateType == "prefix") {
    const prefix = tenseData[tense].prefix[person]
    return prefix + " " + infinitive
  } else {
    return undefined
  }
}

function confirmAnswer() {
  const correctAnswer = conjugate(currentVerb().infinitive, targetConjugation().tense, targetConjugation().person).trim()
  const givenAnswer = userInput().trim()

  if (correctAnswer == givenAnswer) {
    console.log("yeah!")
    setCorrectCount(correctCount() + 1)
  } else {
    console.log("no.")
  }
  setTotalAmount(totalCount() + 1)
  assignRandomQuestion()
  inputBox.value = ""
}

export default App;
