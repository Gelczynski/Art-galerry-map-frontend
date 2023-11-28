// RegistrationScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { register } from "../utils/UserService";

const RegistrationScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleFullNameChange = (text) => setFullName(text);
  const handleEmailChange = (text) => setEmail(text);
  const handlePasswordChange = (text) => setPassword(text);

  const handleRegistration = async () => {
    setIsLoading(true);
    try {
      // const response = await fetch(`${API}/auth/local/register`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(values),
      // });
      const values = {
        email,
        username: email,
        password,
        fullName,
      };

      const response = await register(values);
      const data = await response.json();
      if (data?.error) {
        throw data?.error;
      } else {
        // set the token
        // setToken(data.jwt);
        // // set the user
        // setUser(data.user);
        // message.success(`Welcome to Social Cards ${data.user.username}!`);
        // navigate("/profile", { replace: true });
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error(error);
      setError(error?.message ?? "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {/* Name input */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        onChangeText={handleFullNameChange}
      />

      {/* Email input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={handleEmailChange}
      />

      {/* Password input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        onChangeText={handlePasswordChange}
      />

      {/* Confirm Password input */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        autoCapitalize="none"
      />

      {/* Register button */}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegistration}
      >
        {!isLoading ? (
          <Text style={styles.registerButtonText}>Register</Text>
        ) : (
          <Text>...</Text>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  registerButton: {
    backgroundColor: "#34A853", // Use a color of your choice
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 30,
    color: "#F11",
  },
});

export default RegistrationScreen;
