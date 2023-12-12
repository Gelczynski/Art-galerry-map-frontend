import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const CustomTwitterSignInButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <FontAwesome.Button
        name="twitter"
        style={{ padding: 20 }}
        backgroundColor="#4285F4"
        onPress={onPress}
      >
        Zaloguj przez Twittera
      </FontAwesome.Button>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
});

export default CustomTwitterSignInButton;
