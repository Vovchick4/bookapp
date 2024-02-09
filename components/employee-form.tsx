import * as Yup from "yup";
import { useEffect } from "react";
import { useFormik } from "formik";
import { View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { EUserRole, IUserEntity, TEmployeeCreatePayload } from "../types/user.entity";

import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";

interface IProps {
    isMutating: boolean;
    editData: IUserEntity | null;
    activeId: number | string | null;
    onSubmit: (data: Values) => void;
    onEmployeeIdChange: (id: number | string | null) => void;
}

interface Values extends TEmployeeCreatePayload { }

const initialValues: Values = {
    name: "",
    surname: "",
    email: "",
    phone: "",
    role: EUserRole.employee,
    notes: "",
}

const validationSchema = Yup.object({
    name: Yup.string().trim().required("Поле імені є обовязковим"),
    surname: Yup.string().trim().required("Поле прізвище є обовязковим"),
    email: Yup.string().trim().required("Поле email є обовязковим").email("Укажіть дійсну електронну адресу."),
})

export default function EmployeeForm({ isMutating, activeId, editData, onSubmit, onEmployeeIdChange }: IProps) {
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit
    })
    const { colors } = useAppTheme();

    useEffect(() => {
        if (editData && activeId !== -1) {
            Object.keys(editData).forEach((key) => {
                if (key === "name" || key === "surname" || key === "email" || key === "phone" || key === "notes") {
                    formik.setFieldValue(key, editData[key]);
                }
            })
        }

        return () => {
            formik.resetForm({ values: initialValues });
        }
    }, [activeId, editData])

    return (
        <View>
            <TextInput
                activeOutlineColor={colors.orangeColor}
                mode="outlined"
                label="Ім'я"
                error={!!formik.errors.name}
                autoComplete="name"
                value={formik.values.name}
                onBlur={formik.handleBlur('name')}
                onChangeText={formik.handleChange('name')}
                disabled={isMutating}
            />
            <HelperText type="error" visible={!!formik.errors.name}>
                {formik.errors.name}
            </HelperText>
            <TextInput
                activeOutlineColor={colors.orangeColor}
                mode="outlined"
                label="Прізвище"
                error={!!formik.errors.name}
                autoComplete="name-family"
                value={formik.values.surname}
                onBlur={formik.handleBlur('surname')}
                onChangeText={formik.handleChange('surname')}
                disabled={isMutating}
            />
            <HelperText type="error" visible={!!formik.errors.surname}>
                {formik.errors.surname}
            </HelperText>
            <TextInput
                activeOutlineColor={colors.orangeColor}
                mode="outlined"
                label="Почта"
                error={!!formik.errors.email}
                autoComplete="email"
                value={formik.values.email}
                onBlur={formik.handleBlur('email')}
                onChangeText={formik.handleChange('email')}
                disabled={isMutating}
            />
            <HelperText type="error" visible={!!formik.errors.email}>
                {formik.errors.email}
            </HelperText>
            <TextInput
                activeOutlineColor={colors.orangeColor}
                mode="outlined"
                label="Телефон"
                autoComplete="tel"
                value={formik.values.phone}
                onBlur={formik.handleBlur('phone')}
                onChangeText={formik.handleChange('phone')}
                disabled={isMutating}
            />
            <TextInput
                multiline
                style={{ marginTop: 25 }}
                activeOutlineColor={colors.orangeColor}
                mode="outlined"
                label="Нотатка"
                autoComplete="off"
                value={formik.values.notes}
                onBlur={formik.handleBlur('notes')}
                onChangeText={formik.handleChange('notes')}
                disabled={isMutating}
            />
            <View style={{ marginTop: 20, columnGap: 20, flexDirection: "row" }}>
                <Button
                    mode='outlined'
                    loading={isMutating}
                    disabled={isMutating}
                    textColor={colors.orangeColor}
                    onPress={() => onEmployeeIdChange(null)}
                >
                    Відміна
                </Button>
                <Button
                    mode='outlined'
                    loading={isMutating}
                    disabled={isMutating}
                    textColor={colors.orangeColor}
                    onPress={formik.handleSubmit}
                >
                    Зберегти
                </Button>
            </View>
        </View>
    )
}
