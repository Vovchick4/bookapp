import * as Yup from "yup";
import { useFormik } from "formik";
import { StyleSheet, Text, ScrollView } from "react-native";
import { Button, HelperText, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { PasswordInput } from "../../components";
import { TRegisterPayload } from "../../types/user.entity";
import useRegisterMutateUser from "../../hooks/use-register-mutate-user";
import { useAppTheme } from "../../providers/with-react-paper-ui/with-react-paper-ui";

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login', 'Register'>;

const validationSchema = Yup.object({
    name: Yup.string().trim().required("Поле ім'я є обовязковим"),
    email: Yup.string().required("Поле email є обовязковим").email("Укажіть дійсну електронну адресу."),
    password: Yup.string().trim().required("Поле пароль є обовязковим"),
    confirmPassword: Yup.string().trim()
        .required("Поле підтвердження є обовязковим")
        .oneOf([Yup.ref('password')], 'Пароль має співпалати'),
})

export default function Register({ navigation: { navigate } }: any) {
    const { colors } = useAppTheme();
    const { mutate, error, isPending } = useRegisterMutateUser();
    const formik = useFormik<TRegisterPayload & { confirmPassword: string }>({
        initialValues: { name: '', email: '', password: '', confirmPassword: "" },
        validationSchema,
        onSubmit: (data) => {
            const res = { ...data, confirmPassword: undefined }
            mutate(res);
        }
    });

    return (
        <ScrollView style={styles.surface}>
            <Text style={styles.title}>BookAPP</Text>
            {error && <HelperText style={styles.text_error} type="error" visible={!!error.message}>
                {error.message}
            </HelperText>}
            <TextInput
                activeOutlineColor={colors.orangeColor}
                mode="outlined"
                label="Name"
                error={!!formik.errors.name}
                autoComplete="name"
                value={formik.values.name}
                onBlur={formik.handleBlur('name')}
                onChangeText={formik.handleChange('name')}
            />
            <HelperText type="error" visible={!!formik.errors.name}>
                {formik.errors.name}
            </HelperText>
            <TextInput
                activeOutlineColor={colors.orangeColor}
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
                activeOutlineColor={colors.orangeColor}
                value={formik.values.password}
                error={!!formik.errors.password}
                onBlur={formik.handleBlur('password')}
                onChangeText={formik.handleChange('password')}
            />
            <HelperText type="error" visible={!!formik.errors.password}>
                {formik.errors.password}
            </HelperText>
            <PasswordInput
                activeOutlineColor={colors.orangeColor}
                label="Confirm Password"
                value={formik.values.confirmPassword}
                error={!!formik.errors.confirmPassword}
                onBlur={formik.handleBlur('confirmPassword')}
                onChangeText={formik.handleChange('confirmPassword')}
            />
            <HelperText type="error" visible={!!formik.errors.confirmPassword}>
                {formik.errors.confirmPassword}
            </HelperText>
            <Button loading={isPending} disabled={isPending} style={styles.marginTop} buttonColor={colors.orangeColor} mode="contained" onPress={formik.handleSubmit}>
                Регістрація
            </Button>
            {/* <Divider style={[styles.marginTop, { height: 2 }]} />
            <Button disabled={isPending} style={[styles.marginTop, {}]} buttonColor={colors.orangeColor} mode="contained" onPress={() => navigate("Login")}>
                Якщо є аккаунт
            </Button> */}
        </ScrollView>
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
