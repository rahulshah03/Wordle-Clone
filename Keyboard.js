import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "./colors";

const Keyboard = ({ onPress }) => {
  const KEYROWS = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "CLEAR"],
  ];

  return (
    <View style={{ marginBottom: 40 }}>
      {KEYROWS.map((keys, i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {keys.map((key) => (
            <Pressable key={key} onPress={() => onPress(key)}>
              <View
                style={{
                  backgroundColor: colors.muted,
                  margin: 2,
                  padding: 10,
                  borderRadius: 3,
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontWeight: "500",
                    fontFamily: "Avenir-Medium",
                    fontSize: 14,
                  }}
                >
                  {key}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
};

export default Keyboard;

const styles = StyleSheet.create({});
