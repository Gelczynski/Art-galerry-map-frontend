import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAuth } from "../store/AuthContext";
import { register } from "../utils/UserService";
import Toast from "react-native-toast-message";

const RegistrationScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const { user, setUserContext } = useAuth();

  const handleFullNameChange = (text) => setFullName(text);
  const handleEmailChange = (text) => setEmail(text);
  const handlePasswordChange = (text) => setPassword(text);
  const handlePassword2Change = (text) => setPassword2(text);
  const handleUsernameChange = (text) => setUsername(text);

  useEffect(() => {
    if (user) {
      navigation.navigate("Home");
    }
  }, [user]);

  const handleRegistration = async () => {
    setIsLoading(true);
    try {
      if (!email) {
        setError(error?.message ?? "Nie podano emaila! Email jest wymagany.");
        return ;
      }
      if (!username) {
        setError(error?.message ?? "Nie podano nazwy użytkownika! Te pole jest wymagane.");
        return ;
      }
      if (!password && !password2) {
        setError(error?.message ?? "Brak hasła! Proszę podać brakujące hasło.");
        return ;
      }
      else if (password != password2) {
        setError(error?.message ?? "Hasła nie zgadzają się! Proszę podać takie samo hasło.");
        return ;
      }
      else if (password.length <= 5) {
        setError(error?.message ?? "Hasła muszą mieć przynajmniej 6 znaków!");
        return ;
      }

      const values = {
        email,
        username,
        password,
        fullName,
      };

      const response = await register(values);
      const data = await response.json();
      if (data?.error) {
        throw data?.error;
      } else {
        Toast.show({
          type: "success",
          text1: "Rejestracja dokonana",
          text2: `Witaj ${username}, możesz się już zalogować! 👋`,
        });
        navigation.navigate("Login");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Błąd",
        text2: `Coś poszło nie tak! :(`,
      });
      console.error(error);
      setError(error?.message ?? "Coś poszło nie tak!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rejestracja</Text>

      <TextInput
        style={styles.input}
        placeholder="Imię i nazwisko (opcjonalne)"
        onChangeText={handleFullNameChange}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="adres email"
        autoCapitalize="none"
        onChangeText={handleEmailChange}
      />

      <TextInput
        style={styles.input}
        placeholder="Nazwa użytkownika"
        autoCapitalize="none"
        onChangeText={handleUsernameChange}
      />

      <TextInput
        style={styles.input}
        placeholder="Hasło"
        secureTextEntry
        autoCapitalize="none"
        onChangeText={handlePasswordChange}
      />

      <TextInput
        style={styles.input}
        placeholder="Powtórz hasło"
        secureTextEntry
        autoCapitalize="none"
        onChangeText={handlePassword2Change}
      />

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegistration}
      >
        {!isLoading ? (
          <Text style={styles.registerButtonText}>Zarejestruj się</Text>
        ) : (
          <Text>...</Text>
        )}
      </TouchableOpacity>

      <View style={styles.additionalLinks}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>Zaloguj się</Text>
        </TouchableOpacity>
      </View>

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
    backgroundColor: "#34A853",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  additionalLinks: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 16,
  },
  linkText: {
    color: "#4285F4",
    fontSize: 16,
  },
  errorText: {
    fontSize: 30,
    color: "#F11",
    paddingTop: 15,
  },
});

export default RegistrationScreen;
