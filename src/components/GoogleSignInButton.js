// CustomGoogleSignInButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

const CustomGoogleSignInButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <FontAwesome.Button
        name="google"
        // iconStyle={{ backgroundColor: "#ddd", color: "#f00" }}
        style={{ padding: 20 }}
        backgroundColor="#4285F4"
      >
        Sign in with Google
      </FontAwesome.Button>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default CustomGoogleSignInButton;
