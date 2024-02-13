import { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import { Alert, StatusBar, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import DropDown, { DropDownPropsInterface } from "react-native-paper-dropdown";
import { Button, Checkbox, Icon, IconButton, Modal, Portal, Text, TextInput } from "react-native-paper";

import { IRoomEntity } from "../types/room.entity";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";
import hexToRgba from "../utils/hex-to-rgba";

interface Props {
    mode?: string;
    roomId: number;
    rooms: string
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
}, {
    label: 'Кімната',
    value: 'Кімната',
}, {
    label: 'Будинок',
    value: 'Будинок',
}, {
    label: 'Віла',
    value: 'Віла',
}, {
    label: 'Студія',
    value: 'Студія',
}]

const twentyElements = Array.from({ length: 20 }, (_, index) => ({ label: index + "", value: index }));

const roomColors = [
    "#BA6A6C", "#80B492", "#AF9DC0", "#BEBA80", "#A2A2A2",
    "#2E2E2E", "#CC0129", "#CCB300", "#018235", "#6E9A3B",
    "#A301CB", "#C5342A", "#1A78C2", "#0098AD", "#01776C",
    "#3E8E41", "#CB7A02", "#5E4438", "#7E7E7E", "#4D6471"
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
    sort_order: 0,
}

export default function RoomForm({ mode, roomId, rooms, roomData, onSubmit, deleteRoom }: Props) {
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
            if (roomData && mode === 'update' && roomId !== -1) {
                Object.keys(roomData).forEach((room) => {
                    if (room !== 'id' && room !== 'company_id' && room !== 'created_at' && room !== 'updated_at') {
                        if (roomData[room]) {
                            setFieldValue(room, roomData[room]);
                        }
                    }
                })
            }

            return () => {
                resetForm({ values: initialValues });
                StatusBar.setBackgroundColor(colors.menuColor);
            }
        }, [mode, roomData, roomId])
    );

    useEffect(() => {
        StatusBar.setBackgroundColor(values.with_color ? hexToRgba(values.color, 0.7) || "" : colors.menuColor);
        navigation.setOptions({
            headerStyle: {
                backgroundColor: values.with_color ? hexToRgba(values.color, 0.7) || "" : colors.menuColor,
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
                label="Назва"
                autoComplete="name"
                value={values.name}
                onChangeText={handleChange('name')}
                keyboardType="default"
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
                label="Кількість гостей"
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
            <Text>Позиція в таблиці:</Text>
            {mode === 'update' && typeof rooms === 'string' && (
                <SelectDropdown
                    data={JSON.parse(rooms) as IRoomEntity[]}
                    defaultButtonText={values.sort_order.toString()}
                    onSelect={(selectedItem, index) => {
                        setFieldValue('sort_order', selectedItem.sort_order)
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem.sort_order
                    }}
                    rowTextForSelection={(item, index) => {
                        return item.sort_order
                    }}
                />
            )}
            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
                <Checkbox.Item
                    label="Позначити кольором"
                    status={values.with_color ? 'checked' : "unchecked"}
                    onPress={() => setFieldValue('with_color', !values.with_color)}
                />
                {values.with_color && <Button
                    style={{ width: 34, height: 34, borderRadius: 50, backgroundColor: values.color, opacity: 1, }}
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
                                style={{ width: 34, height: 34, borderRadius: 50, backgroundColor: color, opacity: 1, borderWidth: color === values.color ? 2 : 0, borderColor: 'red' }}
                            />
                        ))}
                    </View>
                </Modal>
            </Portal>
        </View>
    )
}
