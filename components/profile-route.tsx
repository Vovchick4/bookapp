import { useFormik } from "formik";
import { View, ScrollView } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

import { useAuth } from "../contexts/auth";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";
import useUserUpdateMutate from "../hooks/use-user-update-mutate";
import isEqual from "../utils/is-equal";
import { ICompanyEntity, IUserEntity } from "../types/user.entity";
import pickFields from "../utils/object-transform";

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
        onSubmit: (data) => mutate(data)
    })

    return (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <ScrollView style={{ padding: 20 }}>
                <TextInput
                    activeOutlineColor={colors.orangeColor}
                    mode="outlined"
                    label="Ім'я"
                    autoComplete="name"
                    value={formik.values.name}
                    onChangeText={formik.handleChange('name')}
                />
                <TextInput
                    activeOutlineColor={colors.orangeColor}
                    mode="outlined"
                    label="Прізвище"
                    autoComplete="name-family"
                    value={formik.values.surname}
                    onChangeText={formik.handleChange('surname')}
                />
                <TextInput
                    activeOutlineColor={colors.orangeColor}
                    mode="outlined"
                    label="Номер телефону"
                    autoComplete="tel"
                    value={formik.values.phone}
                    onChangeText={formik.handleChange('phone')}
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
                    label="Адресса"
                    autoComplete="address-line1"
                    value={formik.values.address}
                    onChangeText={formik.handleChange('address')}
                />

                <View style={{ marginTop: 20 }}>
                    <Text>Aккаунт створено:</Text>
                    <Text style={{ color: colors.grayColor }}>{user?.created_at}</Text>
                    <Text>Aккаунт оновлено:</Text>
                    <Text style={{ color: colors.grayColor }}>{user?.updated_at}</Text>
                </View>
            </ScrollView>
            <Button
                loading={isPending}
                disabled={isPending ||
                    isEqual<any, Pick<IUserEntity, 'name'>>(
                        pickFields<any>(user, ["name", "surname", "phone", "city", "address"]),
                        formik.values
                    )}
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
