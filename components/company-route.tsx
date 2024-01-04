import { useFormik } from "formik";
import { ScrollView, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../contexts/auth";
import useCompanyUpdateMutate from "../hooks/use-company-update-mutate";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";
import isEqual from "../utils/is-equal";
import { ICompanyEntity } from "../types/user.entity";
import pickFields from "../utils/object-transform";

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
        onSubmit: (data) => mutate(data)
    })

    console.log(pickFields<any>(user?.company, ["name", "city", "post_code", "address", "web_site"]), formik.values);

    return (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <ScrollView style={{ padding: 20 }}>
                <TextInput
                    activeOutlineColor={colors.orangeColor}
                    mode="outlined"
                    label="Name"
                    autoComplete="name"
                    value={formik.values.name}
                    onChangeText={formik.handleChange('name')}
                />
                <TextInput
                    activeOutlineColor={colors.orangeColor}
                    mode="outlined"
                    label="Місто"
                    autoComplete="country"
                    value={formik.values.city}
                    onChangeText={formik.handleChange('city')}
                />
                <TextInput
                    activeOutlineColor={colors.orangeColor}
                    mode="outlined"
                    label="Post code"
                    autoComplete="postal-code"
                    value={formik.values.post_code}
                    onChangeText={formik.handleChange('post_code')}
                />
                <TextInput
                    activeOutlineColor={colors.orangeColor}
                    mode="outlined"
                    label="Адресса"
                    autoComplete="postal-address"
                    value={formik.values.address}
                    onChangeText={formik.handleChange('address')}
                />
                <TextInput
                    activeOutlineColor={colors.orangeColor}
                    mode="outlined"
                    label="Сайт компанії"
                    value={formik.values.web_site}
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
