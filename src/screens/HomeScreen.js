import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  Dimensions,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { useAuth } from "../store/AuthContext";
import MapView, { Callout, Marker } from "react-native-maps";
import { TouchableOpacity } from "react-native";
import { Modal } from "react-native";
import Menu from "../components/Menu";
import { FontAwesome } from "@expo/vector-icons";
import GalleryDetails from "../components/GalleryDetails";

// import { useAuth } from "./AuthContext";
const markers = [
  {
    id: 1,
    title: "galeria SIC! BWA Wrocław",
    address: "pl. Tadeusza Kościuszki 9, 50-438 Wrocław",
    openingHours: [
      {
        days: "pn-czw",
        hours: "11:00-16:00",
      },
      {
        days: "pt-ndz",
        hours: "12:00-20:00",
      },
    ],
    coordinate: { latitude: 51.102575, longitude: 17.028796 },
    visited: true,
  },
  {
    id: 2,
    title: "Galeria Arttrakt",
    address: "Ofiar Oświęcimskich 1/1, 50-069 Wrocław",

    openingHours: [
      {
        days: "pn-czw",
        hours: "12:00-18:00",
      },
      {
        days: "pt-ndz",
        hours: "14:00-18:00",
      },
    ],
    coordinate: { latitude: 51.108734, longitude: 17.029987 },
    visited: false,
  },
  {
    id: 3,
    title: "Galeria Versus",
    address: "Jatki 11, 50-111 Wrocław",
    openingHours: [
      {
        days: "pn-czw",
        hours: "13:00-19:00",
      },
      {
        days: "pt-ndz",
        hours: "14:00-19:00",
      },
    ],
    coordinate: { latitude: 51.112208, longitude: 17.0305 },
    visited: false,
  },
  // Add more markers as needed
];

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [region, setRegion] = useState(initialRegion);
  const [galleries, setGalleries] = useState(markers);

  const mapRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigation.navigate("Login");
    }
  }, [user]);

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const handleListItemSelect = (marker) => {
    // debugger;

    // const mv = mapView.current;
    // console.log(marker, mv);

    // const newRegion = {
    //   latitude: marker.coordinate.latitude,
    //   longitude: marker.coordinate.longitude,
    //   latitudeDelta,
    //   longitudeDelta,
    // };

    // setRegion(newRegion);

    mapRef?.current?.animateCamera({
      center: {
        latitude: marker.coordinate.latitude,
        longitude: marker.coordinate.longitude,
      },
    });
    setMenuVisible(false);
  };

  const handleSetAsVisited = (id) => {
    console.log(id);
    const updatedGalleries = [...galleries].map(
      (gallery) => {
        if (gallery.id === id) {
          return {
            ...gallery,
            visited: true,
          };
        } else return gallery;
      }

      // gallery.id === id
      //   ? {
      //       visited: true,
      //       ...gallery,
      //     }
      //   : gallery
    );

    console.log(updatedGalleries);
    setGalleries(updatedGalleries);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        // initialRegion={initialRegion}
        region={region}
        ref={mapRef}
      >
        {galleries?.map((marker) => (
          // <Marker
          //   key={marker.id}
          //   coordinate={marker.coordinate}
          //   title={marker.title}
          //   description={marker.description}
          // />
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            pinColor="#f00"
            // onPress={(e) => console.log(e.nativeEvent)}
            // onSelect={(e) => console.log(e.nativeEvent)}
          >
            <Image
              source={
                marker.visited
                  ? require("../../assets/icons8-location-80-visited.png")
                  : require("../../assets/icons8-location-80.png")
              }
              style={{ height: 50, width: 50 }}
            />
            <GalleryDetails
              gallery={marker}
              key={marker.id}
              handleSetAsVisited={handleSetAsVisited}
            />
          </Marker>
        ))}
      </MapView>
      <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
        <FontAwesome name="ellipsis-v" size={24} color="#fff" />
      </TouchableOpacity>
      <Modal visible={isMenuVisible} onBackdropPress={toggleMenu}>
        <Menu
          markers={markers}
          onClose={toggleMenu}
          onItemSelect={handleListItemSelect}
        />
      </Modal>
    </View>
  );
};

const { width, height } = Dimensions.get("window");
const aspectRatio = width / height;
const latitudeDelta = 0.0922;
const longitudeDelta = latitudeDelta * aspectRatio;
const initialRegion = {
  latitude: 51.110029,
  longitude: 17.031911,
  latitudeDelta,
  longitudeDelta,
};
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#4285F4", // Google Blue color
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  fabText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default HomeScreen;
