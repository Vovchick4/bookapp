import { useState } from "react";
import { TextInput } from "react-native-paper";

export default function PasswordInput({ ...rest }) {
    const [isVisible, setIsVisible] = useState(true);

    return (
        <TextInput
            mode="outlined"
            label="Password"
            secureTextEntry={isVisible}
            right={isVisible ? <TextInput.Icon icon="eye-off" onPress={() => setIsVisible(prev => !prev)} /> : <TextInput.Icon icon="eye" onPress={() => setIsVisible(prev => !prev)} />}
            {...rest}
        />
    )
}