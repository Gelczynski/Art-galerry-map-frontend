import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { useAuth } from "../store/AuthContext";

// w CMD komenda ipconfig i tam IPv4 Address
const API = "http://192.168.1.6:1337/api";
// const API = "http://localhost:1337/api";
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const { user, setUserContext } = useAuth();

  useEffect(() => {
    if (user) {
      // User is authenticated, navigate to Home screen
      navigation.navigate("Home");
    }
  }, [user]);

  useEffect(() => {
    setError(null);
  }, []);

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleCredentialsLogin = async () => {
    // Implement your credentials login logic here
    console.log(`Logging in with email: ${email} and password: ${password}`);
    setIsLoading(true);
    try {
      const value = {
        identifier: email,
        password: password,
      };

      // const value = {
      //   identifier: "mm@gmail.com",
      //   password: "mmmmmm",
      // };
      // debugger;
      const response = await fetch(`${API}/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      const data = await response.json();
      if (data?.error) {
        throw data?.error;
      } else {
        // set the token
        // setToken(data.jwt);

        // set the user
        setUserContext(data);

        // message.success(`Welcome back ${data.user.username}!`);
        // navigation.navigate("Home");
        // navigate("/profile", { replace: true });
      }
    } catch (error) {
      console.error(error);
      setError(error?.message ?? "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // try {
    //   await GoogleSignin.hasPlayServices();
    //   const userInfo = await GoogleSignin.signIn();
    //   console.log(userInfo);
    //   // Implement your Google login logic here using userInfo
    // } catch (error) {
    //   if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //     // user cancelled the login flow
    //     console.log('Google login cancelled');
    //   } else if (error.code === statusCodes.IN_PROGRESS) {
    //     // operation (e.g. sign in) is in progress already
    //     console.log('Google login in progress');
    //   } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //     // play services not available or outdated
    //     console.log('Google Play services not available');
    //   } else {
    //     // some other error happened
    //     console.error(error);
    //   }
    // }
  };

  if (user) {
    return null; // Render nothing in this case
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text>{email}</Text>

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

      {/* Login button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleCredentialsLogin}
      >
        {isLoading ? (
          <Text>...</Text>
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error.toString()}</Text>}

      {/* Google Sign-In button */}
      <GoogleSignInButton
        onPress={() => console.log("Google Sign-In button pressed")}
      />

      {/* Additional links or text */}
      <View style={styles.additionalLinks}>
        <TouchableOpacity
          onPress={() => console.log("Forgot Password pressed")}
        >
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
          <Text style={styles.linkText}>Register</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => console.log("Register pressed")}
      >
        <Text style={styles.continueText}>Continue as Guest</Text>
      </TouchableOpacity>
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
  loginButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  loginButtonText: {
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

  continueButton: {
    alignSelf: "center",
    padding: 30,
  },
  continueText: {
    fontSize: 30,
    color: "#4285F4",
  },
  errorText: {
    fontSize: 30,
    color: "#F22",
  },
});

export default LoginScreen;
