import { Alert } from "react-native";

export const AsyncAlert = (title, message, buttons = [], options = { cancelable: true }) => {
    return new Promise((resolve) => {
        const processedButtons = buttons.map(button => ({
            ...button,
            onPress: () => {
                if (button.onPress) {
                    const result = button.onPress();
                    resolve(typeof result === "undefined" ? button.text : result);
                } else {
                    resolve(button.text);
                }
            }
        }));

        Alert.alert(title, message, processedButtons, {
            ...options,
            onDismiss: () => resolve(null)
        });
    });
};