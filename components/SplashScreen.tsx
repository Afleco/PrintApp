import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';

interface Props {
  onFinish: () => void;
}

export default function SplashScreenComponent({ onFinish }: Props) {
  const { theme } = useTheme();

  return (
    // color de fondo dinámico
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LottieView
        source={require('../assets/animation.json')} 
        autoPlay
        loop={false} 
        resizeMode="contain"
        style={styles.lottie}
        onAnimationFinish={onFinish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor se maneja inline
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: '80%', 
    height: '80%',
  },
});