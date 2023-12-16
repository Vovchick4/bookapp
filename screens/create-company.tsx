import * as Yup from "yup";
import { useFormik } from "formik";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Button, TextInput, HelperText, Snackbar, Icon } from "react-native-paper";

import { useAuth } from "../contexts/auth";
import { TCreateCompanyPayload } from "../types/user.entity";
import useCreateMutateCompany from "../hooks/use-create-mutate-company";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";

const validationSchema = Yup.object({
    name: Yup.string().trim().required("Поле ім'я є обовязковим"),
})

export default function CreateCompany() {
    const { colors } = useAppTheme();
    const { user } = useAuth();
    const { mutate, error, isPending, reset } = useCreateMutateCompany();
    console.log("🚀 ~ file: create-company.tsx:19 ~ CreateCompany ~ error:", error)
    const formik = useFormik<TCreateCompanyPayload>({
        initialValues: { name: '' },
        validationSchema,
        onSubmit: (data) => {
            mutate(data);
        }
    });

    return (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <ScrollView style={styles.surface}>
                <View>
                    <Text style={styles.title}>Привіт, <Text style={{ color: colors.orangeColor, fontWeight: "700" }}>{user?.name}</Text>!</Text>
                    <Text style={styles.subTitle}>Щоб рухатись дальше потрібно створити компанію:</Text>
                </View>

                <View style={styles.marginTop}>
                    <TextInput
                        disabled={isPending}
                        activeOutlineColor={colors.orangeColor}
                        mode="outlined"
                        label="Ім'я компанії"
                        error={!!formik.errors.name}
                        value={formik.values.name}
                        onBlur={formik.handleBlur('name')}
                        onChangeText={formik.handleChange('name')}
                    />
                    <HelperText type="error" visible={!!formik.errors.name}>
                        {formik.errors.name}
                    </HelperText>

                    <Button loading={isPending} disabled={isPending} style={styles.marginTop} buttonColor={colors.orangeColor} mode="contained" onPress={formik.handleSubmit}>
                        Створити компанію
                    </Button>


                </View>
            </ScrollView>

            <Snackbar
                action={{
                    label: 'Скасувати',
                }}
                style={{ backgroundColor: colors.error }}
                visible={!!error?.message}
                onDismiss={reset}
            >
                <View style={{ flex: 1, columnGap: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <Icon source="alert-circle" size={25} color={colors.surface} />
                    <Text style={{ color: colors.surface }}>{error?.message}</Text>
                </View>
            </Snackbar>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
    },
    subTitle: {
        fontSize: 15,
        marginTop: 10
    },
    surface: {
        padding: 20
    },
    marginTop: {
        marginTop: 20
    },
    text_error: {
        fontSize: 15,
        marginBottom: 20
    }
});
