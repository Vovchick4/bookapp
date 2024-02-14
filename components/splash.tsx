import { StyleSheet, View, Text, Image } from 'react-native';

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
            <Image style={{ width: 100, height: 100, objectFit: 'contain' }} width={50} height={50} source={require('../assets/logo2source-removebg-preview.png')} />
            <Text style={styles.text}>BookApp</Text>
        </View>
    );
}

export default Splash;
