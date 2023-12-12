import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";

const Loader = ({ isVisible }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );

    if (isVisible) {
      animation.start();
    } else {
      animation.stop();
    }

    return () => {
      animation.stop();
    };
  }, [fadeAnim, isVisible]);

  return (
    <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loader;
