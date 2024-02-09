import { useFormik } from "formik";
import { Alert, TouchableOpacity, View } from "react-native";
import { utcToZonedTime } from "date-fns-tz";
import DropDown from "react-native-paper-dropdown";
import { MaterialIcons } from "@expo/vector-icons";
import DialogInput from 'react-native-dialog-input';
import { addDays, differenceInDays, format } from "date-fns";
import { DatePickerInput, TimePickerModal } from 'react-native-paper-dates';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Button, IconButton, Menu, RadioButton, Surface, Text, TextInput } from "react-native-paper";

import Counter from "./counter";
import { EventStatus, IEventEntity } from "../types/event.entity";
import useGetMutateSources from "../hooks/use-get-mutate-sources";
import useCreateSourceMutate from "../hooks/use-create-source-mutate";
import useGetQueryRoomsNames from "../hooks/use-get-query-rooms-names";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";

interface Props {
    mode?: string;
    bookId?: string;
    is_room_vis: boolean;
    start_date: Date | undefined;
    room_id: number;
    roomName: string;
    eventData: IEventEntity;
    onSubmit: (data: any) => void;
    deleteEvent: () => void;
}

interface Values {
    start_date: Date | undefined;
    end_date: Date | undefined;
    time_arrival: Date | undefined;
    time_departure: Date | undefined;
    parents: number;
    childrens: number;
    status: EventStatus;
    price_per_person: number;
    price_per_day: number;
    final_price: number;
    down_payment: number;
    down_payment_date: Date | undefined;
    payment_on_place: number;
    notes: string;
    room_id: number;
    name: string;
    phone: string;
    email: string;
    street: string;
    house_number: string;
    apartment_number: string;
    city: string;
    country: string;
    post_code: string;
    passport: string;
    sources_id: number;
}

const dropStates = {
    room: 'room',
    parent: 'parent',
    source: 'source',
    children: 'children',
    add_sources: 'add_sources',
}

const twentyElements = Array.from({ length: 20 }, (_, index) => ({ label: index + 1 + "", value: index + 1 }));

const initialValues: Values = {
    start_date: undefined,
    end_date: undefined,
    time_arrival: undefined,
    time_departure: undefined,
    parents: 0,
    childrens: 0,
    status: EventStatus.nopaid,
    name: '',
    phone: '',
    email: '',
    street: '',
    house_number: '',
    apartment_number: '',
    city: '',
    country: '',
    post_code: '',
    passport: '',
    price_per_person: 0,
    price_per_day: 0,
    final_price: 0,
    down_payment: 0,
    down_payment_date: undefined,
    payment_on_place: 0,
    notes: '',
    room_id: -1,
    sources_id: 0
}

const pickModalTypes = {
    TA: "TA",
    TD: "TD"
}

// Define your target time zone (e.g., 'Europe/Kiev')
const targetTimeZone = 'Europe/Kiev';

export default function EventForm({ mode, start_date, bookId, room_id, is_room_vis, eventData, onSubmit, deleteEvent }: Props) {
    const { colors } = useAppTheme();
    const navigation = useNavigation();
    const [sourceName, setSourceName] = useState('');
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [dropsListState, setDropsListState] = useState<string | null>(null);
    const [visible, setVisible] = useState<string | null>(null)
    const { values, setFieldValue, resetForm, handleChange, handleSubmit } = useFormik({
        initialValues,
        onSubmit
    });
    const { data, isLoading } = useGetMutateSources();
    const { mutate, isPending: isLoadingCreateSoruce } = useCreateSourceMutate();
    const { data: roomsNames, isLoading: isLoadingRoomsNames } = useGetQueryRoomsNames({ mode: mode || '' });

    const eventStatuses = useMemo(() => ([
        {
            label: 'Повна оплата',
            color: colors.statusPaid,
            value: EventStatus.fullpaid,
        },
        {
            label: 'Занесено завдаток',
            color: colors.statusDeposit,
            value: EventStatus.deposit,
        },
        {
            label: 'Не оплачено',
            color: colors.statusNoPaid,
            value: EventStatus.nopaid,
        },
        {
            label: 'Скасовано',
            color: colors.statusCanceled,
            value: EventStatus.canceled,
        }
    ]), [])

    const statusesColors = useMemo(() => ({
        [EventStatus.fullpaid]: colors.statusPaid,
        [EventStatus.deposit]: colors.statusDeposit,
        [EventStatus.nopaid]: colors.statusNoPaid,
        [EventStatus.canceled]: colors.statusCanceled,
    }), [])

    useFocusEffect(
        useCallback(() => {
            if (room_id) {
                setFieldValue('room_id', room_id);
            }

            if (mode === 'create' && start_date !== undefined) {
                const selectedDate = new Date(start_date);
                selectedDate.setHours(0, 0, 0, 0);
                const startDateInTargetZone = format(utcToZonedTime(selectedDate, targetTimeZone), 'yyyy-MM-dd');
                setFieldValue('start_date', new Date(startDateInTargetZone));
                setFieldValue('sources_id', 0);
            }

            if (eventData && mode === 'update' && bookId !== undefined) {
                // console.log("🚀 ~ file: event-form.tsx:132 ~ useCallback ~ eventData:", eventData)
                Object.keys(eventData).forEach((event) => {
                    if (event !== 'id' && event !== 'rooms_id' && event !== 'created_at' && event !== 'updated_at') {
                        if (eventData[event]) {
                            if (event === 'start_date' || event === 'end_date') {
                                setFieldValue('start_date', new Date(eventData["start_date"]));
                                setFieldValue('end_date', new Date(eventData["end_date"]));
                            } else if (event === 'down_payment_date' && eventData['down_payment_date']) {
                                const inputDate = eventData['down_payment_date'];
                                setFieldValue('down_payment_date', String(inputDate) !== '0000-00-00' ? new Date(inputDate) : undefined);
                            }
                            else {
                                // console.log("🚀 ~ file: event-form.tsx:154 ~ Object.keys ~ event:", event)
                                setFieldValue(event, eventData[event]);
                            }
                        }
                    }
                })
            }

            return () => {
                resetForm({ values: initialValues });
            }
        }, [mode, eventData, room_id, start_date, bookId])
    );

    useEffect(() => {
        // StatusBar.setBackgroundColor(statusesColors[values.status]);
        navigation.setOptions({
            headerStyle: {
                backgroundColor: statusesColors[values.status],
            },
            title: "Book",
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <IconButton icon="content-save" iconColor={colors.surface} onPress={handleSubmit} />
                    {mode === 'update' && <IconButton
                        icon="trash-can"
                        iconColor={colors.surface}
                        onPress={() => {
                            Alert.alert(
                                'Ви дійсно хочете видалити бронювання?',
                                '',
                                [
                                    {
                                        text: 'Ні', // Button text
                                    },
                                    {
                                        text: 'Так', // Button text
                                        onPress: deleteEvent
                                    },
                                ],
                            )
                        }}
                    />}
                </View>
            ),
            headerLeft: () => (
                <IconButton icon="keyboard-backspace" iconColor={colors.surface} size={28} onPress={() => {
                    navigation.goBack();
                }} />
            ),
        });
    }, [values.status])

    // Inside your component

    useEffect(() => {
        // Calculate price per day whenever price_per_person or the number of people changes
        const pricePerDay = (values.parents + values.childrens);
        setFieldValue('price_per_day', pricePerDay);
    }, [values.parents, values.childrens]);

    useEffect(() => {
        if (values.start_date && values.end_date) {
            const daysDifference = differenceInDays(values.end_date, new Date(values.start_date));
            const finalPrice = values.price_per_day * daysDifference;
            setFieldValue('final_price', finalPrice);
        }
    }, [values.start_date, values.end_date, values.price_per_day]);

    useEffect(() => {
        // Calculate payment_on_place whenever final_price or down_payment changes
        const paymentOnPlace = values.final_price - values.down_payment;
        setFieldValue('payment_on_place', paymentOnPlace);
    }, [values.final_price, values.down_payment]);

    const handleStartDateChange = useCallback(
        (value: Date | undefined) => {
            if (value === undefined) {
                return;
            }

            // Reset the time part to avoid time zone offset issues
            const selectedDate = new Date(value);
            selectedDate.setHours(0, 0, 0, 0);

            // Convert received date to target time zone
            const startDateInTargetZone = format(utcToZonedTime(selectedDate, targetTimeZone), 'yyyy-MM-dd');

            // Set start date
            setFieldValue('start_date', new Date(startDateInTargetZone));

            // Calculate end date in the same time zone
            const endDateInTargetZone = new Date(startDateInTargetZone);
            endDateInTargetZone.setDate(endDateInTargetZone.getDate() + 1);

            // Set end date
            setFieldValue('end_date', endDateInTargetZone);

            // Log formatted dates for confirmation (optional)
            // console.log('Start Date:', format(startDateInTargetZone, 'yyyy-MM-dd HH:mm:ssXXX'));
            // console.log('End Date:', format(endDateInTargetZone, 'yyyy-MM-dd HH:mm:ssXXX'));
        },
        [setFieldValue]
    );

    const onShow = (type: string) => {
        setVisible(type);
    }

    const onDismiss = () => {
        setVisible(null);
    }

    const showDialog = () => {
        setDialogVisible(true);
    };

    const handleCancel = () => {
        setDialogVisible(false);
    };

    const handleSubmitPromt = (value: string) => {
        mutate({ name: value });
        setDialogVisible(false);
    };

    return (
        <Fragment>
            <View style={{ flex: 1, rowGap: 10, paddingHorizontal: 10, paddingTop: 10, paddingBottom: 50 }}>
                <Surface style={{ elevation: 5, borderRadius: 5, padding: 10, backgroundColor: colors.surface }}>
                    <DatePickerInput
                        mode="outlined"
                        locale="en-GB"
                        label="start date"
                        inputMode="start"
                        value={values.start_date}
                        onChange={(date) => handleStartDateChange(date)}
                    />
                    <DatePickerInput
                        mode="outlined"
                        locale="en-GB"
                        label="end date"
                        inputMode="end"
                        value={values.end_date}
                        onChange={(value) => setFieldValue('end_date', value)}
                        defaultValue={values.start_date && (new Date(values.start_date).getDate() + 1).toString()}
                    />
                    <View style={{ marginTop: 15, flex: 1, alignItems: 'center' }}>
                        <Button style={{ width: "100%" }} textColor={colors.surface} buttonColor={colors.orangeColor} onPress={() => onShow(pickModalTypes.TA)} uppercase={false} mode="outlined">
                            Час при'їзду  {values.time_arrival ? values.time_arrival?.toString() : '(невказано)'}
                        </Button>
                        <TimePickerModal
                            visible={pickModalTypes.TA === visible}
                            onDismiss={onDismiss}
                            onConfirm={({ hours, minutes }) => {
                                setVisible(null);
                                setFieldValue("time_arrival", `${hours}:${minutes}`);
                            }}
                        />
                    </View>
                    <View style={{ marginTop: 15, flex: 1, alignItems: 'center' }}>
                        <Button style={{ width: "100%" }} textColor={colors.surface} buttonColor={colors.orangeColor} onPress={() => onShow(pickModalTypes.TD)} uppercase={false} mode="outlined">
                            Час від'їзду {values.time_departure ? values.time_departure?.toString() : '(невказано)'}
                        </Button>
                        <TimePickerModal
                            visible={pickModalTypes.TD === visible}
                            onDismiss={onDismiss}
                            onConfirm={({ hours, minutes }) => {
                                setVisible(null);
                                setFieldValue("time_departure", `${hours}:${minutes}`);
                            }}
                        />
                    </View>
                    <Counter
                        count={values.start_date && values.end_date ? differenceInDays(values.start_date || new Date(), values.end_date || new Date()) : 0}
                        onPress={(type) => {
                            if (values.start_date) {
                                if (values.end_date) {
                                    setFieldValue("end_date", addDays(new Date(values.end_date), type === "plus" ? 1 : -1))
                                } else {
                                    setFieldValue("end_date", addDays(new Date(values.start_date), type === "plus" ? 1 : -1))
                                }
                            } else {
                                Alert.alert(
                                    "Виберіть стартову дату!",
                                    "",
                                    [{ text: "OK" }]
                                )
                            }
                        }}
                    />
                </Surface>
                {isLoadingRoomsNames && <ActivityIndicator animating />}
                {(!isLoadingRoomsNames && is_room_vis && mode === 'create' && roomsNames && roomsNames.length > 0) && (
                    <DropDown
                        mode="outlined"
                        label="Вибір кімнати:"
                        list={roomsNames.map(({ name, id }) => ({ label: name, value: id }))}
                        value={values.room_id === -1 ? undefined : values.room_id}
                        activeColor={colors.orangeColor}
                        setValue={(value) => setFieldValue('room_id', Number(value))}
                        visible={dropStates.room === dropsListState}
                        showDropDown={() => setDropsListState(dropStates.room)}
                        onDismiss={() => setDropsListState(null)}
                    />
                )}

                <DropDown
                    mode="outlined"
                    label="Дорослі:"
                    list={twentyElements}
                    value={values.parents}
                    activeColor={colors.orangeColor}
                    setValue={(value) => setFieldValue('parents', value)}
                    visible={dropStates.parent === dropsListState}
                    showDropDown={() => setDropsListState(dropStates.parent)}
                    onDismiss={() => setDropsListState(null)}
                />
                <DropDown
                    mode="outlined"
                    label="Діти:"
                    list={twentyElements}
                    value={values.childrens}
                    activeColor={colors.orangeColor}
                    setValue={(value) => setFieldValue('childrens', value)}
                    visible={dropStates.children === dropsListState}
                    showDropDown={() => setDropsListState(dropStates.children)}
                    onDismiss={() => setDropsListState(null)}
                />
                <Surface style={{ elevation: 5, borderRadius: 5, backgroundColor: colors.surface }}>
                    <Text style={{ padding: 10 }}>Статус бронювання:</Text>
                    <RadioButton.Group value={values.status} onValueChange={(value) => setFieldValue('status', value)}>
                        {eventStatuses.map(({ label, value, color }) => (
                            <RadioButton.Item key={value} label={label} color={color} value={value} />
                        ))}
                    </RadioButton.Group>
                </Surface>
                <Surface style={{ rowGap: 10, elevation: 5, borderRadius: 5, padding: 10, backgroundColor: colors.surface }}>
                    <Text>Інформація про клієнта:</Text>
                    <TextInput
                        activeOutlineColor={colors.orangeColor}
                        mode="outlined"
                        label="Name"
                        autoComplete="name"
                        value={values.name}
                        onChangeText={handleChange('name')}
                    />
                    <TextInput
                        activeOutlineColor={colors.orangeColor}
                        mode="outlined"
                        label="Phone"
                        autoComplete="tel"
                        value={values.phone}
                        onChangeText={handleChange('phone')}
                    />
                    <TextInput
                        activeOutlineColor={colors.orangeColor}
                        mode="outlined"
                        label="Passport"
                        value={values.passport}
                        onChangeText={handleChange('passport')}
                    />

                    {(isLoading || isLoadingCreateSoruce) && <ActivityIndicator animating />}
                    <View style={{ position: 'relative' }}>
                        {!isLoading && !isLoadingCreateSoruce && data && data?.length > 0 && (
                            <>
                                <View>
                                    <Menu
                                        visible={dropStates.source === dropsListState}
                                        onDismiss={() => setDropsListState(null)}
                                        anchor={<Button contentStyle={{ justifyContent: "flex-start" }} mode="outlined" onPress={() => setDropsListState(dropStates.source)}>{values.sources_id !== 0 ? data.find(({ value }) => Number(value) === values.sources_id)?.label : 'Походження:'}</Button>}
                                    >
                                        {data.map((item) => (
                                            <Menu.Item
                                                key={item.value}
                                                title={item.label}
                                                onPress={() => {
                                                    setFieldValue('sources_id', Number(item.value));
                                                    setDropsListState(null);
                                                }}
                                            />
                                        ))}
                                    </Menu>
                                </View>
                                <View style={{ position: 'absolute', top: '50%', right: 20, transform: [{ translateY: -10 }], flexDirection: 'row', columnGap: 10 }}>
                                    <TouchableOpacity onPress={showDialog}>
                                        <MaterialIcons name="edit" size={22} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setFieldValue('sources_id', 0)}>
                                        <MaterialIcons name="clear" size={22} />
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </Surface>
                <Surface style={{ rowGap: 10, elevation: 5, borderRadius: 5, padding: 10, backgroundColor: colors.surface }}>
                    <Text>Калькулятор ціни:</Text>
                    <TextInput
                        activeOutlineColor={colors.orangeColor}
                        mode="outlined"
                        label="Ціна за добу"
                        value={String(values.price_per_day)}
                        onChangeText={handleChange('price_per_day')}
                    />
                    <TextInput
                        activeOutlineColor={colors.orangeColor}
                        mode="outlined"
                        label="Кінцева ціна"
                        value={String(values.final_price)}
                        onChangeText={handleChange('final_price')}
                    />
                    <TextInput
                        activeOutlineColor={colors.orangeColor}
                        mode="outlined"
                        label="Завдаток"
                        value={String(values.down_payment)}
                        onChangeText={handleChange('down_payment')}
                    />
                    <DatePickerInput
                        mode="outlined"
                        locale="en-GB"
                        label="Дата завдатку"
                        inputMode="start"
                        value={values.down_payment_date}
                        onChange={(value) => setFieldValue('down_payment_date', value)}
                    />
                    <View>
                        <Text style={{ fontWeight: "800", fontSize: 17 }}>Ціна на місці:</Text>
                        <Text style={{ fontWeight: "800", fontSize: 17, color: colors.notification }}>{values.payment_on_place}</Text>
                    </View>
                </Surface>

                <TextInput
                    activeOutlineColor={colors.orangeColor}
                    multiline
                    mode="outlined"
                    label="Нотатка"
                    value={String(values.notes)}
                    onChangeText={handleChange('notes')}
                />
            </View>

            <DialogInput
                isDialogVisible={isDialogVisible}
                title={'Enter Text'}
                message={'Please enter your text:'}
                hintInput={'Type here...'}
                submitInput={handleSubmitPromt}
                closeDialog={handleCancel}
            >
                <TextInput
                    value={sourceName}
                    onChangeText={(text) => setSourceName(text)}
                    autoFocus={true}
                />
            </DialogInput>
        </Fragment>
    )
}
