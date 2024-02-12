import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ScrollView, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { AntDesign, Entypo, MaterialIcons, Feather } from "@expo/vector-icons";
import DropDown, { DropDownPropsInterface } from "react-native-paper-dropdown";

import isEqual from "../utils/is-equal";
import { useAuth } from "../contexts/auth";
import pickFields from "../utils/object-transform";
import { ICompanyEntity } from "../types/user.entity";
import useCompanyUpdateMutate from "../hooks/use-company-update-mutate";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";

const validationSchema = Yup.object({
    name: Yup.string().trim().required("Поле ім'я є обовязковим")
})

const dropStates = {
    currency: "currency"
}

const roomTypes: DropDownPropsInterface['list'] = [{
    label: 'Гривня UAH',
    value: 'UAH',
},
{
    label: 'Долар USD',
    value: 'USD',
}, {
    label: 'Євро EUR',
    value: 'EUR',
}]

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
            currency: user?.company.currency || ""
        },
        validationSchema,
        onSubmit: (data) => mutate(data)
    })
    const [dropsListState, setDropsListState] = useState<string | null>(null);

    return (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <ScrollView>
                <View style={{ padding: 20 }}>
                    <View style={{ position: 'relative' }}>
                        <Feather
                            name='user'
                            size={25}
                            color={colors.onSurface}
                            style={{ position: 'absolute', top: 20, left: 12, zIndex: 9999 }}
                        />
                        <TextInput
                            left={<TextInput.Icon icon="web" style={{ opacity: 0 }} />}
                            activeOutlineColor={colors.orangeColor}
                            mode="outlined"
                            label="Назва"
                            autoComplete="name"
                            error={!!formik.errors.name}
                            value={formik.values.name}
                            onBlur={formik.handleBlur('name')}
                            onChangeText={formik.handleChange('name')}
                            keyboardType="default"
                        />
                        <HelperText type="error" visible={!!formik.errors.name}>
                            {formik.errors.name}
                        </HelperText>
                    </View>

                    <View style={{ position: 'relative' }}>
                        <MaterialIcons
                            name='location-city'
                            size={25}
                            color={colors.onSurface}
                            style={{ position: 'absolute', top: 20, left: 12, zIndex: 9999 }}
                        />
                        <TextInput
                            left={<TextInput.Icon icon="web" style={{ opacity: 0 }} />}
                            activeOutlineColor={colors.orangeColor}
                            mode="outlined"
                            label="Місто"
                            autoComplete="country"
                            value={formik.values.city}
                            onBlur={formik.handleBlur('city')}
                            onChangeText={formik.handleChange('city')}
                            keyboardType="default"
                        />
                    </View>

                    <View style={{ position: 'relative', marginTop: 20 }}>
                        <AntDesign
                            name='mail'
                            size={25}
                            color={colors.onSurface}
                            style={{ position: 'absolute', top: 20, left: 12, zIndex: 9999 }}
                        />
                        <TextInput
                            left={<TextInput.Icon icon="web" style={{ opacity: 0 }} />}
                            activeOutlineColor={colors.orangeColor}
                            mode="outlined"
                            label="Post code"
                            autoComplete="postal-code"
                            value={formik.values.post_code}
                            onBlur={formik.handleBlur('post_code')}
                            onChangeText={formik.handleChange('post_code')}
                            keyboardType="default"
                        />
                    </View>

                    <View style={{ position: 'relative', marginTop: 20 }}>
                        <Entypo
                            name='address'
                            size={25}
                            color={colors.onSurface}
                            style={{ position: 'absolute', top: 20, left: 12, zIndex: 9999 }}
                        />
                        <TextInput
                            left={<TextInput.Icon icon="web" style={{ opacity: 0 }} />}
                            activeOutlineColor={colors.orangeColor}
                            mode="outlined"
                            label="Адресса"
                            autoComplete="postal-address"
                            value={formik.values.address}
                            onBlur={formik.handleBlur('address')}
                            onChangeText={formik.handleChange('address')}
                            keyboardType="default"
                        />
                    </View>

                    <TextInput
                        style={{ marginTop: 20 }}
                        left={<TextInput.Icon icon="web" />}
                        activeOutlineColor={colors.orangeColor}
                        mode="outlined"
                        label="Сайт компанії"
                        value={formik.values.web_site}
                        onBlur={formik.handleBlur('web_site')}
                        onChangeText={formik.handleChange('web_site')}
                        keyboardType="default"
                    />

                    <View style={{ position: 'relative', marginTop: 20 }}>
                        <DropDown
                            mode="outlined"
                            label="Тип"
                            list={roomTypes}
                            value={formik.values.currency}
                            activeColor={colors.orangeColor}
                            setValue={(value) => formik.setFieldValue('currency', value)}
                            visible={dropStates.currency === dropsListState}
                            showDropDown={() => setDropsListState(dropStates.currency)}
                            onDismiss={() => setDropsListState(null)}
                        />
                    </View>
                </View>
            </ScrollView>
            <Button
                loading={isPending}
                disabled={isPending || isEqual<any, Pick<ICompanyEntity, 'name'>>(pickFields<any>(user?.company, ["name", "city", "post_code", "address", "web_site", "currency"]), formik.values)}
                style={[{ borderRadius: 15 }]}
                mode="outlined"
                textColor={colors.surface}
                buttonColor={colors.orangeColor}
                onPress={formik.handleSubmit}
            >
                Зберегти
            </Button>
        </View>
    )
}
