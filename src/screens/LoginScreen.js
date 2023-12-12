import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import TwitterSignInButton from "../components/TwitterSignInButton";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { useAuth } from "../store/AuthContext";
import { InAppBrowser } from "react-native-inappbrowser-reborn";
import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import {
  makeRedirectUri,
  useAuthRequest,
  CodeChallengeMethod,
  AccessTokenRequest,
} from "expo-auth-session";
import CryptoJS from "react-native-crypto-js";
import {
  checkIfTwitterUserExist,
  createTwitterUser,
} from "../utils/UserService";

const API = "http://192.168.0.137:1337/api";

function base64URLEncode(str) {
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function generateRandomString(length = 64) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const codeVerifier = generateRandomString();

WebBrowser.maybeCompleteAuthSession();
const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [codeChallenge, setCodeChallenge] = useState("");

  const { user, setUserContext } = useAuth();

  const discovery = {
    authorizationEndpoint: "https://twitter.com/i/oauth2/authorize",
  };

  const tokenEndpoint = "https://api.twitter.com/oauth2/token";
  const tokenEndpoint2 = "https://api.twitter.com/2/oauth2/token";

  const useProxy = Platform.select({ web: false, default: true });
  const redirectUri = makeRedirectUri({ useProxy });
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "V1E0a05GVGMwR1QybG11WlRESUc6MTpjaQ",
      clientSecret: "PR3jfv6x2j_RCMXzPDPxlvP6hJ3ubr476uczCxxbO_amyhWYHv",
      redirectUri: "exp://",
      usePKCE: true,
      scopes: ["tweet.read", "users.read"],
      codeChallangeMethod: CodeChallengeMethod.S256,
      codeChallange: codeChallenge,
    },
    discovery
  );

  console.log(`Redirect URL: ${redirectUri}`);

  const handleUsernameChange = (text) => {
    setUsername(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };
  useEffect(() => {
    if (user) {
      navigation.navigate("Home");
    }
  }, [user]);

  useEffect(() => {
    async function generateCodeChallenge() {
      try {
        const hashedCodeVerifier = CryptoJS.SHA256(codeVerifier).toString(
          CryptoJS.enc.Base64
        );
        const base64UrlEncoded = base64URLEncode(hashedCodeVerifier);
        console.log(base64UrlEncoded);
        setCodeChallenge(base64UrlEncoded);
      } catch (error) {
        console.log(error);
      }

    }
    generateCodeChallenge();
    setError(null);
  }, []);

  useEffect(() => {
    console.log("REQUEST", request, "RESPONSE", response);
    if (response?.type === "success") {
      const { code } = response.params;

      fetch(
        tokenEndpoint2 +
          `?grant_type=authorization_code&client_id=V1E0a05GVGMwR1QybG11WlRESUc6MTpjaQ&redirect_uri=exp://&code_verifier=${request.codeVerifier}&code=${code}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
        .then((response) => {
          if (!response) {
            throw new Error("Coś poszło nie tak");
          }
          return response.json();
        })
        .then((data) => {

          const bearerToken = data?.access_token;

          fetch("https://api.twitter.com/2/users/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          })
            .then((res) => res.json())
            .then((result) => {
              if (result?.data?.username) {
                const usernameTwitter = result.data.username;
                checkIfTwitterUserExist(usernameTwitter)
                  .then((resp) => resp.json())
                  .then((result) => {
                    if (result.data.length === 0) {
                      console.log("RESULT: ", JSON.stringify(result));
                      createTwitterUser({
                        username: usernameTwitter,
                      })
                        .then((res) => {
                          console.log("RES: ", JSON.stringify(res));
                          return res.json();
                        })
                        .then((result) => {
                          if (result?.data?.attributes.username) {
                            setUserContext({
                              username: result?.data?.attributes.username,
                            });
                          }
                        });
                    } else {
                      console.log("ELSE", JSON.stringify(result));
                      setUserContext({ username: usernameTwitter });
                    }
                  });
              }
            });
        })
        .catch((error) => {
          // Handle errors
          console.error("Error fetching bearer token:", error);
        });
    }
  }, [response]);

  const handleCredentialsLogin = async () => {
    setIsLoading(true);
    try {
      if (!username) {
        setError("Nie podano nazwę użytkownika! Pole jest wymagane.");
        return ;
      }
      if (!password) {
        setError("Nie podano hasła! Proszę podać hasło.");
        return ;
      }

      const value = {
        identifier: username,
        password: password,
      };

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
        setUserContext({ username });
      }
    } catch (error) {
      console.error(error);
      if (error?.message == "Invalid identifier or password") {
        setError("Niepoprawny adres email lub hasło! Proszę podać poprawne dane.");
        return ;
      }
      else setError(error?.message ?? "Coś poszło nie tak!");
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zaloguj się</Text>
      <TextInput
        style={styles.input}
        placeholder="Nazwa użytkownika"
        keyboardType="default"
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

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleCredentialsLogin}
      >
        {isLoading ? (
          <Text>...</Text>
        ) : (
          <Text style={styles.loginButtonText}>Zaloguj się</Text>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error.toString()}</Text>}

      <TwitterSignInButton
        onPress={() => {
          promptAsync();
        }}
      />

      <View style={styles.additionalLinks}>

        <TouchableOpacity onPress={() => {navigation.navigate("Registration"), setError("")}}>
          <Text style={styles.linkText}>Zarejestruj się</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => setUserContext(1)}
      >
        <Text style={styles.continueText}>Kontynuuj jako gość</Text>
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
