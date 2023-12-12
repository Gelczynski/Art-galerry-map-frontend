import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useAuth } from "../store/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import { SearchBar } from "react-native-elements";

const Menu = ({ markers, onClose, onItemSelect }) => {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [filteredMarkers, setFilteredMarkers] = useState(markers);

  useEffect(() => {
    console.log("MARKERS: ", markers);
    const filtered = markers.filter(({ attributes }) =>
      attributes.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredMarkers(filtered);
  }, [search, markers]);

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Wyszukaj..."
        onChangeText={(text) => setSearch(text)}
        value={search}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInputContainer}
        inputStyle={styles.searchBarInput}
      />
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <FontAwesome name="times" size={20} color="#fff" />
      </TouchableOpacity>
      <FlatList
        data={filteredMarkers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.markerItem}
            onPress={() => onItemSelect(item)}
          >
            <Text>{item.attributes.title}</Text>
          </TouchableOpacity>
        )}
        style={styles.list}
      />

      {user && !user.username ? (
        <View>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>
              Wróć do ekranu logowania
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {user && user.username ? (
        <View>
          <Text style={styles.userText}>Witaj {user.username}👋</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>Wyloguj się</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  searchBarContainer: {
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    marginTop: 75,
  },
  searchBarInputContainer: {
    backgroundColor: "#e1e1e1",
  },
  searchBarInput: {
    backgroundColor: "#fff",
    paddingLeft: 10,
  },
  markerItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 16,
    backgroundColor: "#4285F4",
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  list: {
    paddingTop: 40,
    padding: 16,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#4285F4",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  userText: {
    color: "#4285F4",
    fontSize: 20,
    textAlign: "center",
  },
});

export default Menu;
