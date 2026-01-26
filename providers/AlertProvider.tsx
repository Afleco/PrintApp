import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from './ThemeProvider';


type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type AlertContextType = {
  showAlert: (title: string, message: string, buttons?: AlertButton[]) => void;
};

const AlertContext = createContext<AlertContextType>({ showAlert: () => {} });

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [buttons, setButtons] = useState<AlertButton[]>([]);

  const showAlert = (title: string, msg: string, btns?: AlertButton[]) => {
    setTitle(title);
    setMessage(msg);
    // Si no se pasan botones, ponemos un "OK" por defecto
    setButtons(btns && btns.length > 0 ? btns : [{ text: 'OK', style: 'default' }]);
    setVisible(true);
  };

  const handleButtonPress = (btn: AlertButton) => {
    setVisible(false);
    if (btn.onPress) btn.onPress();
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      
      {/* Componente Visual del Modal */}
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)} // Para botón atrás en Android
      >
        <View style={styles.overlay}>
          <View style={[styles.alertBox, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
            <Text style={[styles.message, { color: theme.colors.textSecondary }]}>{message}</Text>
            
            <View style={styles.buttonContainer}>
              {buttons.map((btn, index) => {
                // Estilos dinámicos por botón
                let btnColor = theme.colors.primary;
                if (btn.style === 'cancel') btnColor = theme.colors.textSecondary;
                if (btn.style === 'destructive') btnColor = theme.colors.error;

                return (
                  <TouchableOpacity 
                    key={index} 
                    onPress={() => handleButtonPress(btn)}
                    style={[styles.button, { borderTopColor: theme.colors.backgroundSecondary }]}
                  >
                    <Text style={[styles.buttonText, { color: btnColor, fontWeight: btn.style === 'cancel' ? '400' : 'bold' }]}>
                      {btn.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertBox: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    paddingTop: 24,
    alignItems: 'center',
    // Sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap-reverse', // Para que si hay muchos botones se apilen
  },
  button: {
    flex: 1, // Para distribuir espacio
    minWidth: 100,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // Borde superior para separar botones del texto (estilo iOS)
    borderTopWidth: 0, 
    marginTop: 8,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 16,
  },
});