import { createElement } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons';
import { View, ScrollView } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";

import { useAuth } from "../contexts/auth";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";
import useUserUpdateMutate from "../hooks/use-user-update-mutate";
import isEqual from "../utils/is-equal";
import { IUserEntity } from "../types/user.entity";
import pickFields from "../utils/object-transform";

const validationSchema = Yup.object({
    name: Yup.string().trim().required("Поле ім'я є обовязковим")
})

export default function PofileRoute() {
    const { user } = useAuth();
    const { colors } = useAppTheme();
    const { mutate, isPending } = useUserUpdateMutate();
    const formik = useFormik({
        initialValues: {
            name: user?.name || "",
            surname: user?.surname || "",
            phone: user?.phone || "",
            city: user?.city || "",
            address: user?.address || "",
        },
        validationSchema,
        onSubmit: (data) => mutate(data)
    })

    return (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <ScrollView style={{ padding: 20 }}>
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
                        label="Ім'я"
                        error={!!formik.errors.name}
                        autoComplete="name"
                        value={formik.values.name}
                        onBlur={formik.handleBlur('name')}
                        onChangeText={formik.handleChange('name')}
                    />
                </View>
                <HelperText type="error" visible={!!formik.errors.name}>
                    {formik.errors.name}
                </HelperText>
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
                        label="Прізвище"
                        autoComplete="name-family"
                        value={formik.values.surname}
                        onBlur={formik.handleBlur('surname')}
                        onChangeText={formik.handleChange('surname')}
                    />
                </View>
                <View style={{ position: 'relative', marginTop: 20 }}>
                    <Feather
                        name='phone'
                        size={25}
                        color={colors.onSurface}
                        style={{ position: 'absolute', top: 20, left: 12, zIndex: 9999 }}
                    />
                    <TextInput
                        left={<TextInput.Icon icon="web" style={{ opacity: 0 }} />}
                        activeOutlineColor={colors.orangeColor}
                        mode="outlined"
                        label="Номер телефону"
                        autoComplete="tel"
                        value={formik.values.phone}
                        onBlur={formik.handleBlur('phone')}
                        onChangeText={formik.handleChange('phone')}
                    />
                </View>
                <View style={{ position: 'relative', marginTop: 20 }}>
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
                        autoComplete="postal-address-region"
                        value={formik.values.city}
                        onBlur={formik.handleBlur('city')}
                        onChangeText={formik.handleChange('city')}
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
                        autoComplete="address-line1"
                        value={formik.values.address}
                        onBlur={formik.handleBlur('address')}
                        onChangeText={formik.handleChange('address')}
                    />
                </View>

                {/* <View style={{ marginTop: 20 }}>
                    <Text>Aккаунт створено:</Text>
                    <Text style={{ color: colors.grayColor }}>{user?.created_at}</Text>
                    <Text>Aккаунт оновлено:</Text>
                    <Text style={{ color: colors.grayColor }}>{user?.updated_at}</Text>
                </View> */}
            </ScrollView>
            <Button
                loading={isPending}
                disabled={isPending ||
                    isEqual<any, Pick<IUserEntity, 'name'>>(
                        pickFields<any>(user, ["name", "surname", "phone", "city", "address"]),
                        formik.values
                    )}
                style={[{ borderRadius: 15 }]}
                mode="outlined"
                buttonColor={colors.orangeColor}
                onPress={formik.handleSubmit}
            >
                Зберегти
            </Button>
        </View>
    )
}
