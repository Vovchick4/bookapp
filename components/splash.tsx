import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 30,
        fontWeight: '500',
    },
});

function Splash() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>BookApp</Text>
        </View>
    );
}

export default Splash;