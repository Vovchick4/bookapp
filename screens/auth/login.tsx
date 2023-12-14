import * as Yup from "yup";
import { useFormik } from "formik";
import { StyleSheet, Text, View } from "react-native";
import { Button, Divider, HelperText, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { PasswordInput } from "../../components";
import useLoginMutateUser from "../../hooks/use-login-mutate-user";
import { UserEntity } from "../../types/user.entity";

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login', 'Register'>;

const validationSchema = Yup.object({
    email: Yup.string().trim().required("Поле email є обовязковим").email("Укажіть дійсну електронну адресу."),
    password: Yup.string().trim().required("Поле пароль є обовязковим")
})

export default function Login({ navigation: { navigate } }: any) {
    const { mutate, error, isPending } = useLoginMutateUser();
    const formik = useFormik<Omit<UserEntity, "id" | "name" | "remember_token">>({
        initialValues: { email: '', password: '' },
        validationSchema,
        onSubmit: (data) => {
            mutate(data);
        }
    });

    return (
        <View style={styles.surface}>
            <Text style={styles.title}>BookAPP</Text>
            {error && <HelperText style={styles.text_error} type="error" visible={!!error.message}>
                {error.message}
            </HelperText>}
            <TextInput
                mode="outlined"
                label="Email"
                error={!!formik.errors.email}
                autoComplete="email"
                value={formik.values.email}
                onBlur={formik.handleBlur('email')}
                onChangeText={formik.handleChange('email')}
            />
            <HelperText type="error" visible={!!formik.errors.email}>
                {formik.errors.email}
            </HelperText>
            <PasswordInput
                value={formik.values.password}
                error={!!formik.errors.password}
                onBlur={formik.handleBlur('password')}
                onChangeText={formik.handleChange('password')}
            />
            <HelperText type="error" visible={!!formik.errors.password}>
                {formik.errors.password}
            </HelperText>
            <Button loading={isPending} style={styles.marginTop} mode="contained" onPress={formik.handleSubmit}>
                Login
            </Button>
            <Divider style={styles.marginTop} />
            <Button loading={isPending} style={styles.marginTop} mode="contained" onPress={() => navigate("Register")}>
                Create account
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 25,
        textAlign: "center",
        paddingVertical: 20
    },
    surface: {
        paddingHorizontal: 20
    },
    marginTop: {
        marginTop: 20
    },
    text_error: {
        fontSize: 15,
        marginBottom: 20
    }
});
