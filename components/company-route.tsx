import * as Yup from "yup";
import { useFormik } from "formik";
import { ScrollView, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { useAuth } from "../contexts/auth";
import useCompanyUpdateMutate from "../hooks/use-company-update-mutate";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";
import isEqual from "../utils/is-equal";
import { ICompanyEntity } from "../types/user.entity";
import pickFields from "../utils/object-transform";

const validationSchema = Yup.object({
    name: Yup.string().trim().required("Поле ім'я є обовязковим")
})

export default function CopmanyRoute() {
    const { user } = useAuth();
    const { colors } = useAppTheme();
    const { mutate, isPending } = useCompanyUpdateMutate();
    const formik = useFormik({
        initialValues: {
            name: user?.company.name || "",
            city: user?.company.city || "",
            post_code: user?.company.post_code || "",
            address: user?.company.address || "",
            web_site: user?.company.web_site || "",
        },
        validationSchema,
        onSubmit: (data) => mutate(data)
    })

    return (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <ScrollView style={{ padding: 20 }}>
                <TextInput
                    left={<TextInput.Icon icon="supervised-user-circle" />}
                    activeOutlineColor={colors.orangeColor}
                    mode="outlined"
                    label="Name"
                    autoComplete="name"
                    error={!!formik.errors.name}
                    value={formik.values.name}
                    onBlur={formik.handleBlur('name')}
                    onChangeText={formik.handleChange('name')}
                />
                <HelperText type="error" visible={!!formik.errors.name}>
                    {formik.errors.name}
                </HelperText>
                <TextInput
                    left={<TextInput.Icon icon="location-city" />}
                    activeOutlineColor={colors.orangeColor}
                    mode="outlined"
                    label="Місто"
                    autoComplete="country"
                    value={formik.values.city}
                    onBlur={formik.handleBlur('city')}
                    onChangeText={formik.handleChange('city')}
                />
                <TextInput
                    left={<TextInput.Icon icon="barcode-reader" />}
                    activeOutlineColor={colors.orangeColor}
                    mode="outlined"
                    label="Post code"
                    autoComplete="postal-code"
                    value={formik.values.post_code}
                    onBlur={formik.handleBlur('post_code')}
                    onChangeText={formik.handleChange('post_code')}
                />
                <TextInput
                    left={<TextInput.Icon icon="edit-location-alt" />}
                    activeOutlineColor={colors.orangeColor}
                    mode="outlined"
                    label="Адресса"
                    autoComplete="postal-address"
                    value={formik.values.address}
                    onBlur={formik.handleBlur('address')}
                    onChangeText={formik.handleChange('address')}
                />
                <TextInput
                    left={<TextInput.Icon icon="web" />}
                    activeOutlineColor={colors.orangeColor}
                    mode="outlined"
                    label="Сайт компанії"
                    value={formik.values.web_site}
                    onBlur={formik.handleBlur('web_site')}
                    onChangeText={formik.handleChange('web_site')}
                />

                <View style={{ marginTop: 20 }}>
                    <Text>Компанію створено:</Text>
                    <Text style={{ color: colors.grayColor }}>{user?.company.created_at}</Text>
                    <Text>Компанію оновлено:</Text>
                    <Text style={{ color: colors.grayColor }}>{user?.company.updated_at}</Text>
                </View>
            </ScrollView>
            <Button
                loading={isPending}
                disabled={isPending || isEqual<any, Pick<ICompanyEntity, 'name'>>(pickFields<any>(user?.company, ["name", "city", "post_code", "address", "web_site"]), formik.values)}
                style={[{ borderRadius: 15 }]}
                mode="contained"
                buttonColor={colors.orangeColor}
                onPress={formik.handleSubmit}
            >
                Зберегти
            </Button>
        </View>
    )
}
