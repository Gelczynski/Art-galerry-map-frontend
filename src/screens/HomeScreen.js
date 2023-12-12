import React, { useEffect, useRef, useState } from "react";
import { View, Dimensions, StyleSheet, Image, Platform } from "react-native";
import { useAuth } from "../store/AuthContext";
import MapView, { Callout, Marker } from "react-native-maps";
import { TouchableOpacity } from "react-native";
import { Modal } from "react-native";
import Menu from "../components/Menu";
import { FontAwesome } from "@expo/vector-icons";
import GalleryDetails from "../components/GalleryDetails";
import Loader from "../components/Loader";
import {
  getAllGalleries,
  getMyVisitedGalleries,
  setGalleryAsVisited,
} from "../utils/GalleryService";

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [region, setRegion] = useState(initialRegion);
  const [galleries, setGalleries] = useState([]);

  const [loading, setLoading] = useState(true);

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
    console.log("MARK: ", JSON.stringify(marker));
    mapRef?.current?.animateCamera({
      center: {
        latitude: marker.attributes.coordinate.latitude,
        longitude: marker.attributes.coordinate.longitude,
      },
    });
    setMenuVisible(false);
  };

  const handleSetAsVisited = (galleryId) => {
    console.log(galleryId);

    setGalleryAsVisited(user.username, galleryId)
      .then((res) => res.json())
      .then((result) => {
        console.log("GAL: ", JSON.stringify(result));
        setMyGalleries();
      });
  };

  useEffect(() => {
    setLoading(true);
    setMyGalleries();
  }, []);

  const setMyGalleries = () => {
    getAllGalleries()
      .then((resp) => resp.json())
      .then((result) => {
        const galleries = result?.data?.map((gal) => ({
          ...gal,
          visited: false,
        }));
        console.log(galleries);

        console.log("USER", JSON.stringify(user));
        if (user === 1) {
          setGalleries(galleries);
          setLoading(false);
        } else if (user && user.username) {
          getMyVisitedGalleries(user.username)
            .then((resp) => resp.json())
            .then((result) => {
              const visitedIds = result.data.map((obj) =>
                parseInt(obj.attributes.galleryId)
              );

              const updatedGalleries = galleries.map((gal) => {
                // debugger;
                if (visitedIds.includes(gal.id)) {
                  return {
                    ...gal,
                    visited: true,
                  };
                } else {
                  return gal;
                }
              });

              setGalleries(updatedGalleries);
              setLoading(false);

              console.log("IPDATED", updatedGalleries);
            });
        }
        // }
      });
  };

  return loading ? (
    <Loader isVisible={true} />
  ) : (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        ref={mapRef}
      >
        {galleries?.map(({ id, attributes, visited }) => (
          <Marker
            key={id}
            coordinate={attributes.coordinate}
            title={attributes.title}
            pinColor="#f00"
          >
            <Image
              source={
                visited
                  ? require("../../assets/icons8-location-80-visited.png")
                  : require("../../assets/icons8-location-80.png")
              }
              style={{ height: 50, width: 50 }}
            />
            <GalleryDetails
              id={id}
              visited={visited}
              gallery={attributes}
              key={id}
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
          markers={galleries}
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
    backgroundColor: "#4285F4",
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
