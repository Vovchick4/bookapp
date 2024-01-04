import { useFormik } from "formik";
import { Alert, StatusBar, View } from "react-native";
import DropDown from "react-native-paper-dropdown";
import { DatePickerInput } from 'react-native-paper-dates';
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Button, IconButton, RadioButton, Surface, Text, TextInput } from "react-native-paper";
import { EventStatus, IEventEntity } from "../types/event.entity";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";
import Collapsible from "react-native-collapsible";
import { differenceInDays, format } from "date-fns";
import useGetQueryRoomsNames from "../hooks/use-get-query-rooms-names";
import { utcToZonedTime } from "date-fns-tz";

interface Props {
    mode?: string;
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
    parents: number;
    childrens: number;
    status: EventStatus;
    price_per_person: number;
    price_per_day: number;
    final_price: number;
    down_payment: number;
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
}

const dropStates = {
    parent: 'parent',
    children: 'children',
    room: 'room',
}

const twentyElements = Array.from({ length: 20 }, (_, index) => ({ label: index + 1 + "", value: index + 1 }));

const initialValues: Values = {
    start_date: undefined,
    end_date: undefined,
    parents: 0,
    childrens: 0,
    status: EventStatus.pending,
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
    payment_on_place: 0,
    notes: '',
    room_id: -1
}

// Define your target time zone (e.g., 'Europe/Kiev')
const targetTimeZone = 'Europe/Kiev';

export default function EventForm({ mode, start_date, room_id, is_room_vis, eventData, onSubmit, deleteEvent }: Props) {
    const { colors } = useAppTheme();
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [expanded, setExpanded] = useState(true);
    const [dropsListState, setDropsListState] = useState<string | null>(null);
    const { values, setValues, setFieldValue, resetForm, handleChange, handleSubmit } = useFormik({
        initialValues,
        onSubmit
    });
    const { data: roomsNames, isLoading: isLoadingRoomsNames } = useGetQueryRoomsNames({ mode: mode || '' });

    const eventStatuses = useMemo(() => ([
        {
            label: 'В очікувані',
            color: colors.statusPending,
            value: EventStatus.pending,
        },
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
        [EventStatus.pending]: colors.statusPending,
        [EventStatus.fullpaid]: colors.statusPaid,
        [EventStatus.deposit]: colors.statusDeposit,
        [EventStatus.nopaid]: colors.statusNoPaid,
        [EventStatus.canceled]: colors.statusCanceled,
    }), [])

    useFocusEffect(
        useCallback(() => {
            resetForm({ values: initialValues });
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            if (room_id) {
                setFieldValue('room_id', room_id);
            }
        }, [room_id])
    );

    useFocusEffect(
        useCallback(() => {
            if (eventData && mode === 'update') {
                // console.log("🚀 ~ file: event-form.tsx:132 ~ useCallback ~ eventData:", eventData)
                Object.keys(eventData).forEach((event) => {
                    if (event !== 'id' && event !== 'rooms_id' && event !== 'created_at' && event !== 'updated_at') {
                        if (eventData[event]) {
                            if (event === 'start_date' || event === 'end_date') {
                                // console.log("🚀 ~ file: event-form.tsx:154 ~ Object.keys ~ event:", new Date(eventData[event]))
                                setFieldValue('start_date', new Date(eventData["start_date"]));
                                setFieldValue('end_date', new Date(eventData["end_date"]));
                            } else {
                                // console.log("🚀 ~ file: event-form.tsx:154 ~ Object.keys ~ event:", event)
                                setFieldValue(event, eventData[event]);
                            }
                        }
                    }
                })
            }
        }, [mode, eventData])
    );

    useFocusEffect(
        useCallback(() => {
            if (mode === 'create' && start_date !== undefined) {
                const selectedDate = new Date(start_date);
                selectedDate.setHours(0, 0, 0, 0);
                const startDateInTargetZone = format(utcToZonedTime(selectedDate, targetTimeZone), 'yyyy-MM-dd');
                setFieldValue('start_date', new Date(startDateInTargetZone));
            }
        }, [mode, start_date])
    );

    useEffect(() => {
        if (isFocused) {
            StatusBar.setBackgroundColor(statusesColors[values.status]);
        }
        navigation.setOptions({
            headerStyle: {
                backgroundColor: statusesColors[values.status],
            },
            title: values.name ? values.name : "Book",
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
                    resetForm();
                    setFieldValue('start_date', '');
                    setFieldValue('parents', 0);
                    setFieldValue('childrens', 0);
                    StatusBar.setBackgroundColor(colors.menuColor);
                    navigation.goBack();
                }} />
            ),
        });
    }, [isFocused, values.name, values.status])

    // Inside your component

    useEffect(() => {
        // Calculate price per day whenever price_per_person or the number of people changes
        const pricePerDay = (values.parents + values.childrens) * values.price_per_person;
        setFieldValue('price_per_day', pricePerDay);
    }, [values.parents, values.childrens, values.price_per_person]);

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

    console.log(values);
    // console.log(values.start_date, values.end_date);

    return (
        <Fragment>
            <View style={{ flex: 1, rowGap: 10, padding: 10 }}>
                <DatePickerInput
                    mode="outlined"
                    locale="en"
                    label="start date"
                    inputMode="start"
                    value={values.start_date}
                    onChange={(date) => handleStartDateChange(date)}
                />
                <DatePickerInput
                    mode="outlined"
                    locale="en"
                    label="end date"
                    inputMode="end"
                    value={values.end_date}
                    onChange={(value) => setFieldValue('end_date', value)}
                    defaultValue={values.start_date && (new Date(values.start_date).getDate() + 1).toString()}
                />
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
                        // error={!!formik.errors.email}
                        autoComplete="name"
                        value={values.name}
                        // onBlur={formik.handleBlur('email')}
                        onChangeText={handleChange('name')}
                    />
                    <TextInput
                        activeOutlineColor={colors.orangeColor}
                        mode="outlined"
                        label="Phone"
                        // error={!!formik.errors.email}
                        autoComplete="tel"
                        value={values.phone}
                        // onBlur={formik.handleBlur('email')}
                        onChangeText={handleChange('phone')}
                    />
                    <TextInput
                        activeOutlineColor={colors.orangeColor}
                        mode="outlined"
                        label="Email"
                        // error={!!formik.errors.email}
                        autoComplete="email"
                        value={values.email}
                        // onBlur={formik.handleBlur('email')}
                        onChangeText={handleChange('email')}
                    />
                    <Button mode="contained" onPress={() => setExpanded(prev => !prev)}>
                        Додаткова інформація:
                    </Button>
                    <Collapsible collapsed={expanded}>
                        <View>
                            <TextInput
                                activeOutlineColor={colors.orangeColor}
                                mode="outlined"
                                label="Street"
                                // error={!!formik.errors.email}
                                autoComplete="address-line1"
                                value={values.street}
                                // onBlur={formik.handleBlur('email')}
                                onChangeText={handleChange('street')}
                            />
                            <TextInput
                                activeOutlineColor={colors.orangeColor}
                                mode="outlined"
                                label="House number"
                                // error={!!formik.errors.email}
                                autoComplete="address-line2"
                                value={values.house_number}
                                // onBlur={formik.handleBlur('email')}
                                onChangeText={handleChange('house_number')}
                            />
                            <TextInput
                                activeOutlineColor={colors.orangeColor}
                                mode="outlined"
                                label="Apartment number"
                                // error={!!formik.errors.email}
                                autoComplete="address-line2"
                                value={values.apartment_number}
                                // onBlur={formik.handleBlur('email')}
                                onChangeText={handleChange('apartment_number')}
                            />
                            <TextInput
                                activeOutlineColor={colors.orangeColor}
                                mode="outlined"
                                label="City"
                                // error={!!formik.errors.email}
                                value={values.city}
                                // onBlur={formik.handleBlur('email')}
                                onChangeText={handleChange('city')}
                            />
                            <TextInput
                                activeOutlineColor={colors.orangeColor}
                                mode="outlined"
                                label="Country"
                                // error={!!formik.errors.email}
                                value={values.country}
                                // onBlur={formik.handleBlur('email')}
                                onChangeText={handleChange('country')}
                            />
                            <TextInput
                                activeOutlineColor={colors.orangeColor}
                                mode="outlined"
                                label="Post code"
                                // error={!!formik.errors.email}
                                value={values.post_code}
                                // onBlur={formik.handleBlur('email')}
                                onChangeText={handleChange('post_code')}
                            />
                            <TextInput
                                activeOutlineColor={colors.orangeColor}
                                mode="outlined"
                                label="Passport"
                                // error={!!formik.errors.email}
                                value={values.passport}
                                // onBlur={formik.handleBlur('email')}
                                onChangeText={handleChange('passport')}
                            />
                        </View>
                    </Collapsible>
                </Surface>
                <Surface style={{ rowGap: 10, elevation: 5, borderRadius: 5, padding: 10, backgroundColor: colors.surface }}>
                    <Text>Калькулятор ціни:</Text>
                    <TextInput
                        activeOutlineColor={colors.orangeColor}
                        mode="outlined"
                        label="Ціна за людину"
                        value={String(values.price_per_person)}
                        onChangeText={handleChange('price_per_person')}
                    />
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
                    <View>
                        <Text>Ціна на місці:</Text>
                        <Text>{values.payment_on_place}</Text>
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
        </Fragment>
    )
}
