import { StatusBar } from "react-native";
import { StatusBarProps } from "expo-status-bar";

export default function StatusBarManager({ backgroundColor, ...props }: StatusBarProps) {
    return <StatusBar backgroundColor={backgroundColor} {...props} />;
};