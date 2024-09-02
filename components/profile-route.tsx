import { useState } from "react";
import * as Yup from "yup";
import { Formik, useFormik } from "formik";
import { View, ScrollView, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons';
import { Button, Divider, HelperText, Modal, Portal, TextInput } from "react-native-paper";

import isEqual from "../utils/is-equal";
import { useAuth } from "../contexts/auth";
import PasswordInput from "./password-input";
import { IUserEntity } from "../types/user.entity";
import pickFields from "../utils/object-transform";
import useUserUpdateMutate from "../hooks/use-user-update-mutate";
import useUserChangePassMutate from "../hooks/use-user-change-pass-mutate";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";

const validationSchema = Yup.object({
    name: Yup.string().trim().required("Поле ім'я є обов'язковим"),
    email: Yup.string().trim().email("Укажіть дійсну електронну адресу.").required("Поле пошта є обов'язковим"),
})

const validationSchemaPassword = Yup.object({
    password: Yup.string().trim().required("Поле пароль є обов'язковим"),
    new_password: Yup.string().trim().required("Поле новий пароль є обов'язковим"),
    new_confirm_password: Yup.string().trim()
        .required("Поле підтвердження є обов'язковим")
        .oneOf([Yup.ref('new_password')], 'Пароль має співпадати з новим паролем'),
})

export default function ProfileRoute() {
    const { user } = useAuth();
    const { colors } = useAppTheme();
    const { mutate, isPending } = useUserUpdateMutate();
    const { mutate: changePass, isPending: isPendingPass } = useUserChangePassMutate({ onSuccess: hideModal });
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const formik = useFormik({
        initialValues: {
            name: user?.name || "",
            email: user?.email || "",
            surname: user?.surname || "",
            phone: user?.phone || "",
            city: user?.city || "",
            address: user?.address || "",
        },
        validationSchema,
        onSubmit: (data) => mutate(data)
    })

    function hideModal() {
        setIsVisibleModal(false);
    }

    return (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <ScrollView>
                <View style={{ padding: 20 }}>
                    <View style={{ position: 'relative' }}>
                        <Feather
                            name='mail'
                            size={25}
                            color={colors.onSurface}
                            style={{ position: 'absolute', top: 20, left: 12, zIndex: 9999 }}
                        />
                        <TextInput
                            left={<TextInput.Icon icon="web" style={{ opacity: 0 }} />}
                            activeOutlineColor={colors.orangeColor}
                            mode="outlined"
                            label="Пошта"
                            error={!!formik.errors.email}
                            autoComplete="email"
                            value={formik.values.email}
                            onBlur={formik.handleBlur('email')}
                            onChangeText={formik.handleChange('email')}
                            keyboardType="default"
                        />
                        <HelperText type="error" visible={!!formik.errors.email}>
                            {formik.errors.email}
                        </HelperText>
                    </View>
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
                            keyboardType="default"
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
                            label="Адреса"
                            autoComplete="address-line1"
                            value={formik.values.address}
                            onBlur={formik.handleBlur('address')}
                            onChangeText={formik.handleChange('address')}
                        />
                    </View>

                    <TouchableOpacity onPress={() => setIsVisibleModal(true)}>
                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: colors.onSurface,
                                padding: 15,
                                marginTop: 20,
                                borderRadius: 5,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                <Feather name="lock" size={22} />
                                <Text style={{ fontSize: 16, }}>Змінити пароль</Text>
                            </View>
                            <MaterialIcons name="arrow-forward-ios" size={22} />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Button
                loading={isPending}
                disabled={isPending ||
                    isEqual<any, Pick<IUserEntity, 'name'>>(
                        pickFields<any>(user, ["name", "email", "surname", "phone", "city", "address"]),
                        formik.values
                    )}
                style={[{ borderRadius: 15 }]}
                mode="outlined"
                textColor={colors.surface}
                buttonColor={colors.orangeColor}
                onPress={formik.handleSubmit}
            >
                Зберегти
            </Button>

            <Portal>
                <Modal visible={isVisibleModal} onDismiss={hideModal} contentContainerStyle={{ padding: 20, backgroundColor: colors.surface }}>
                    <Formik
                        initialValues={{ password: '', new_password: '', new_confirm_password: '', }}
                        validationSchema={validationSchemaPassword}
                        onSubmit={values => changePass(values)}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                            <View>
                                <PasswordInput
                                    mode="outlined"
                                    label="Старий пароль"
                                    error={!!errors.password}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    disabled={isPendingPass}
                                />
                                <HelperText type="error" visible={!!errors.password}>
                                    {errors.password}
                                </HelperText>
                                <Divider style={{ height: 2, marginBottom: 15 }} />
                                <PasswordInput
                                    mode="outlined"
                                    label="Новий пароль"
                                    error={!!errors.new_password}
                                    onChangeText={handleChange('new_password')}
                                    onBlur={handleBlur('new_password')}
                                    value={values.new_password}
                                    disabled={isPendingPass}
                                />
                                <HelperText type="error" visible={!!errors.new_password}>
                                    {errors.new_password}
                                </HelperText>
                                <PasswordInput
                                    mode="outlined"
                                    label="Підтвердження нового паролю"
                                    error={!!errors.new_confirm_password}
                                    onChangeText={handleChange('new_confirm_password')}
                                    onBlur={handleBlur('new_confirm_password')}
                                    value={values.new_confirm_password}
                                    disabled={isPendingPass}
                                />
                                <HelperText type="error" visible={!!errors.new_confirm_password}>
                                    {errors.new_confirm_password}
                                </HelperText>
                                <Button loading={isPendingPass} disabled={isPendingPass} style={{ marginTop: 5 }} mode="contained" onPress={handleSubmit}>
                                    Змінити пароль
                                </Button>
                            </View>
                        )}
                    </Formik>
                </Modal>
            </Portal>
        </View>
    )
}
