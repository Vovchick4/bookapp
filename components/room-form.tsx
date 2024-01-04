import { useFormik } from "formik";
import { Alert, StatusBar, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import DropDown, { DropDownPropsInterface } from "react-native-paper-dropdown";
import { Button, Checkbox, Icon, IconButton, Modal, Portal, Text, TextInput } from "react-native-paper";

import { IRoomEntity } from "../types/room.entity";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";

interface Props {
    mode?: string;
    roomId: number;
    roomData: IRoomEntity;
    onSubmit: (data: any) => void;
    deleteRoom: () => void;
}

const dropStates = {
    type: 'type',
    count_room: 'count_room',
    additional_beds: 'additional_beds',
    number_of_singles: 'number_of_singles',
    number_of_doubles: 'number_of_doubles',
}

const roomTypes: DropDownPropsInterface['list'] = [{
    label: 'Квартира',
    value: 'Квартира',
}]

const twentyElements = Array.from({ length: 20 }, (_, index) => ({ label: index + "", value: index }));

const roomColors = [
    "#000000", "#111111", "#222222", "#333333", "#444444",
    "#555555", "#838388", "#777777", "#888888", "#999999",
    "#AAAAAA", "#BBBBBB", "#CCCCCC", "#DDDDDD", "#EEEEEE",
    "#FFFFAA", "#FF0000", "#00FF00", "#0000FF", "#FFFF00"
];

const initialValues = {
    name: '',
    type: 'Квартира',
    count_room: 0,
    additional_beds: 0,
    number_of_single_beds: 0,
    number_of_double_beds: 0,
    color: roomColors[0],
    with_color: false,
}

export default function RoomForm({ mode, roomId, roomData, onSubmit, deleteRoom }: Props) {
    const { colors } = useAppTheme();
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);
    const [dropsListState, setDropsListState] = useState<string | null>(null);
    const { values, setFieldValue, handleChange, handleSubmit, resetForm } = useFormik({
        initialValues,
        onSubmit
    });

    useFocusEffect(
        useCallback(() => {
            resetForm({ values: initialValues });
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            if (roomData && mode === 'update' && roomId !== -1) {
                console.log(roomData);

                Object.keys(roomData).forEach((room) => {
                    if (room !== 'id' && room !== 'company_id' && room !== 'created_at' && room !== 'updated_at') {
                        if (roomData[room]) {
                            setFieldValue(room, roomData[room]);
                        }
                    }
                })
            }
        }, [mode, roomData, roomId])
    );

    useEffect(() => {
        StatusBar.setBackgroundColor(values.with_color ? values.color : colors.menuColor);
        navigation.setOptions({
            headerStyle: {
                backgroundColor: values.with_color ? values.color : colors.menuColor,
            },
            title: mode === "update" ? "Редагувати помешкання" : "Створити помешкання",
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <IconButton icon="content-save" iconColor={colors.surface} onPress={handleSubmit} />
                    {mode === 'update' && <IconButton
                        icon="trash-can"
                        iconColor={colors.surface}
                        onPress={() => {
                            Alert.alert(
                                'Ви дійсно хочете видалити помешкання?',
                                '',
                                [
                                    {
                                        text: 'Ні', // Button text
                                    },
                                    {
                                        text: 'Так', // Button text
                                        onPress: deleteRoom
                                    },
                                ],
                            )
                        }}
                    />}
                </View>
            ),
            headerLeft: () => (
                <IconButton icon="keyboard-backspace" iconColor={colors.surface} size={28} onPress={() => {
                    resetForm({ values: initialValues });
                    StatusBar.setBackgroundColor(colors.menuColor);
                    navigation.goBack()
                }} />
            ),
        });
    }, [mode, values.color, values.with_color])

    return (
        <View style={{ flex: 1, rowGap: 10, padding: 10 }}>
            <TextInput
                activeOutlineColor={colors.orangeColor}
                mode="outlined"
                label="Name"
                autoComplete="name"
                value={values.name}
                onChangeText={handleChange('name')}
            />
            <DropDown
                mode="outlined"
                label="Тип"
                list={roomTypes}
                value={values.type}
                activeColor={colors.orangeColor}
                setValue={(value) => setFieldValue('type', value)}
                visible={dropStates.type === dropsListState}
                showDropDown={() => setDropsListState(dropStates.type)}
                onDismiss={() => setDropsListState(null)}
            />
            <DropDown
                mode="outlined"
                label="Ємність кімнати"
                list={twentyElements}
                value={values.count_room}
                activeColor={colors.orangeColor}
                setValue={(value) => setFieldValue('count_room', value)}
                visible={dropStates.count_room === dropsListState}
                showDropDown={() => setDropsListState(dropStates.count_room)}
                onDismiss={() => setDropsListState(null)}
            />
            <DropDown
                mode="outlined"
                label="Додаткові ліжка"
                list={twentyElements}
                value={values.additional_beds}
                activeColor={colors.orangeColor}
                setValue={(value) => setFieldValue('additional_beds', value)}
                visible={dropStates.additional_beds === dropsListState}
                showDropDown={() => setDropsListState(dropStates.additional_beds)}
                onDismiss={() => setDropsListState(null)}
            />
            <DropDown
                mode="outlined"
                label="Кількість односпальних ліжок"
                list={twentyElements}
                value={values.number_of_single_beds}
                activeColor={colors.orangeColor}
                setValue={(value) => setFieldValue('number_of_single_beds', value)}
                visible={dropStates.number_of_singles === dropsListState}
                showDropDown={() => setDropsListState(dropStates.number_of_singles)}
                onDismiss={() => setDropsListState(null)}
            />
            <DropDown
                mode="outlined"
                label="Кількість двоспальних ліжок"
                list={twentyElements}
                value={values.number_of_double_beds}
                activeColor={colors.orangeColor}
                setValue={(value) => setFieldValue('number_of_double_beds', value)}
                visible={dropStates.number_of_doubles === dropsListState}
                showDropDown={() => setDropsListState(dropStates.number_of_doubles)}
                onDismiss={() => setDropsListState(null)}
            />
            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
                <Checkbox.Item
                    label="Позначити кольором"
                    status={values.with_color ? 'checked' : "unchecked"}
                    onPress={() => setFieldValue('with_color', !values.with_color)}
                />
                {values.with_color && <Button
                    style={{ width: 34, height: 34, borderRadius: 50, backgroundColor: values.color }}
                    children={undefined}
                    onPress={() => setVisible(true)}
                />}
            </View>

            <Portal>
                <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{ padding: 20, backgroundColor: colors.surface }}>
                    <Text variant="displayMedium" style={{ marginBottom: 15 }}>Виберіть колір:</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                        {roomColors.length > 0 && roomColors.map((color) => (
                            <Button
                                key={color}
                                children={undefined}
                                onPress={() => { setFieldValue('color', color); setVisible(false); }}
                                style={{ width: 34, height: 34, borderRadius: 50, backgroundColor: color, opacity: 0.2, borderWidth: color === values.color ? 2 : 0, borderColor: 'red' }}
                            />
                        ))}
                    </View>
                </Modal>
            </Portal>
        </View>
    )
}
