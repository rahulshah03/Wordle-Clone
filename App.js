import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import colors from "./colors";
import Keyboard from "./Keyboard";
import words from "./words";

export default function App() {
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [evaluation, setEvaluation] = useState([]);
  const [word, setWord] = useState(
    words[Math.floor(Math.random() * words.length)].toUpperCase().split("")
  );
  const [input, setInput] = useState({
    0: ["", "", "", "", ""],
    1: ["", "", "", "", ""],
    2: ["", "", "", "", ""],
    3: ["", "", "", "", ""],
    4: ["", "", "", "", ""],
    5: ["", "", "", "", ""],
  });

  const getLetterStatus = (letter, newEvaluation) => {
    let count = 0;
    word.forEach((element) => {
      if (element === letter) count++;
    });

    let occurences = 0;
    newEvaluation.forEach((item) => {
      if (item !== "unknown") {
        if (item.letter === letter) occurences++;
      }
    });
    if (occurences < count) return { letter, state: "present" };
    return { letter, state: "absent" };
  };

  const evaluateWord = () => {
    if (currentRow <= 5) {
      const newEvaluation = [];
      for (let i = 0; i < 5; i++) {
        if (word[i] === input[currentRow][i])
          newEvaluation.push({ letter: word[i], state: "correct" });
        else newEvaluation.push("unknown");
      }
      for (let i = 0; i < 5; i++) {
        if (newEvaluation[i] === "unknown") {
          if (!word.includes(input[currentRow][i])) {
            newEvaluation[i] = {
              letter: input[currentRow][i],
              state: "absent",
            };
          }
        }
      }
      for (let i = 0; i < 5; i++) {
        if (newEvaluation[i] === "unknown") {
          newEvaluation[i] = getLetterStatus(
            input[currentRow][i],
            newEvaluation
          );
        }
      }

      const evaluationStates = [...evaluation];
      const finalState = [];
      newEvaluation.forEach((item) => finalState.push(item.state));
      evaluationStates.push(finalState);
      setEvaluation(evaluationStates);
      return evaluationStates;
    }
  };

  const setBackgroundColor = (row, col, property) => {
    if (evaluation[row]) {
      const state = evaluation[row][col];
      if (state === "present") return colors.present;
      else if (state === "correct") return colors.correct;
      else if (state === "absent") return colors.absent;
    } else {
      if (property === "background") return colors.black;
      else return colors.muted;
    }
  };

  const getGameStatus = (evaluations) => {
    const lastEvaluation = evaluations[evaluations.length - 1];
    const gameState = lastEvaluation.every((item) => item === "correct");
    if (gameState) return "won";
    else if (!gameState && evaluations.length === 6) return "over";
    else return "inProgress";
  };

  const resetGame = () => {
    setCurrentCol(0);
    setCurrentRow(0);
    setEvaluation([]);
    setWord(
      words[Math.floor(Math.random() * words.length)].toUpperCase().split("")
    );
    setInput({
      0: ["", "", "", "", ""],
      1: ["", "", "", "", ""],
      2: ["", "", "", "", ""],
      3: ["", "", "", "", ""],
      4: ["", "", "", "", ""],
      5: ["", "", "", "", ""],
    });
  };

  const checkResult = () => {
    if (input[currentRow]) {
      if (input[currentRow].includes("")) {
        Alert.alert("Word is not complete.");
      } else {
        const evaluations = evaluateWord();
        const gameStatus = getGameStatus(evaluations);
        if (gameStatus === "won") {
          Alert.alert(
            "You WON!!!",
            `You got it in ${currentRow + 1} ${
              currentRow + 1 === 1 ? "try" : "tries"
            }`,
            [
              {
                text: "Back",
                onPress: resetGame,
              },
            ]
          );
        } else if (gameStatus === "over") {
          Alert.alert("Uh-Oh!!!", `The correct word was ${word.join("")}.`, [
            {
              text: "Back",
              onPress: resetGame,
            },
          ]);
        } else if (currentRow < 5) {
          setCurrentRow(currentRow + 1);
          setCurrentCol(0);
        }
      }
    }
  };

  const changeInput = (key) => {
    if (key === "ENTER") {
      checkResult();
    } else if (currentCol <= 5 && currentRow < 6) {
      let col = currentCol;
      const wordArea = { ...input };
      if (key === "CLEAR") {
        wordArea[currentRow][col - 1] = "";
        setInput(wordArea);
        col = col - 1;
        setCurrentCol(col < 0 ? 0 : col);
      } else if (currentCol < 5) {
        wordArea[currentRow][col] = key;
        setInput(wordArea);
        col = col + 1;
        setCurrentCol(col);
      }
    }
  };

  const renderInputs = () => {
    const textInputs = Object.keys(input).map((inp, row) => (
      <View key={row} style={{ flexDirection: "row" }}>
        {input[inp].map((item, col) => (
          <View
            key={col}
            style={[
              styles.inputContainer,
              {
                backgroundColor: setBackgroundColor(row, col, "background"),
                borderColor: setBackgroundColor(row, col, "border"),
              },
            ]}
          >
            <Text style={styles.input}> {input[row][col]}</Text>
          </View>
        ))}
      </View>
    ));
    return textInputs;
  };

  return (
    <View style={styles.container}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.header}>WORDLE</Text>
        <View style={styles.inputs}>{renderInputs()}</View>
      </View>
      <Keyboard onPress={(key) => changeInput(key)} />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: "space-between",
  },
  header: {
    marginTop: 60,
    textAlign: "center",
    fontSize: 40,
    color: colors.white,
    letterSpacing: 15,
    fontFamily: "Avenir-Medium",
    fontWeight: "500",
  },
  inputs: {
    alignItems: "center",
    marginTop: 20,
  },
  inputContainer: {
    margin: 2,
    borderWidth: 2,
    borderColor: colors.muted,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Avenir-Medium",
    justifyContent: "center",
    alignItems: "center",
  },
});
