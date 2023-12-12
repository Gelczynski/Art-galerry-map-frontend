import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Button, Text } from "react-native-elements";
import { Callout } from "react-native-maps";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../store/AuthContext";

const GalleryDetails = ({ gallery, handleSetAsVisited, id, visited }) => {
  const { user } = useAuth();

  return (
    <Callout
      style={{
        width: 250,
        height: user === 1 ? 130 : 200,
        display: "flex",
        justifyContent: "space-between",
      }}
      onPress={(e) => {
        console.log(e);
        if (e.nativeEvent.point?.y > 150) {
          handleSetAsVisited(id);
        }
      }}
    >
      <View>
        <Text style={styles.calloutTitle}>{gallery.title}</Text>
        <Text style={styles.calloutAddress}>{gallery.address}</Text>
        {gallery.openingHours.map((obj) => (
          <Text style={styles.calloutHours} key={obj.days}>
            {obj.days}: {obj.hours}
          </Text>
        ))}
      </View>
      {user !== 1 ? (
        visited ? (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FontAwesome
              name="check"
              size={30}
              color="green"
              style={styles.icon}
            />
            <Text>Galeria już została odwiedzona :)</Text>
          </View>
        ) : (
          <Button
            title="Oznacz jako odwiedzone"
          ></Button>
        )
      ) : null}
    </Callout>
  );
};

const styles = StyleSheet.create({
  calloutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  calloutAddress: {
    fontSize: 16,
    marginBottom: 5,
  },
  calloutHours: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
});

export default GalleryDetails;
