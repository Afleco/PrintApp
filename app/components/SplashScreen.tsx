import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../../styles/theme';

interface Props {
  onFinish: () => void;
}

export default function SplashScreenComponent({ onFinish }: Props) {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/animation.json')} 
        autoPlay
        loop={false} // para que no se repita infinitamente
        resizeMode="contain"
        style={styles.lottie}
        onAnimationFinish={onFinish} // Avisa cuando termina
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: '80%', 
    height: '80%',
  },
});