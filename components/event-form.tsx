import { useFormik } from "formik";
import { StatusBar, View } from "react-native";
import DropDown from "react-native-paper-dropdown";
import { DatePickerInput } from 'react-native-paper-dates';
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Button, Icon, IconButton, List, RadioButton, Surface, Text, TextInput } from "react-native-paper";
import { EventStatus, IEventEntity } from "../types/event.entity";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";
import Collapsible from "react-native-collapsible";
import { differenceInCalendarDays, differenceInDays, parseISO } from "date-fns";
import useGetQueryRoomsNames from "../hooks/use-get-query-rooms-names";

interface Props {
    mode?: string;
    is_room_vis: boolean;
    start_date: Date | undefined;
    room_id: number;
    roomName: string;
    eventData: IEventEntity;
    onSubmit: (data: any) => void;
}

interface Values {
    start_date: Date | undefined;
    end_date: Date | undefined;
    parents: number;
    childrens: number;
    status: EventStatus;
    client: any;
    price_per_person: number;
    price_per_day: number;
    final_price: number;
    down_payment: number;
    payment_on_place: number;
    notes: string;
    room_id: number;
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
    client: {
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
    },
    price_per_person: 0,
    price_per_day: 0,
    final_price: 0,
    down_payment: 0,
    payment_on_place: 0,
    notes: '',
    room_id: -1
}

export default function EventForm({ mode, start_date, room_id, is_room_vis, eventData, onSubmit }: Props) {
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
    }), [values.status])

    useFocusEffect(
        useCallback(() => {
            resetForm({ values: initialValues });
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            if (eventData && mode === 'update') {
                console.log("🚀 ~ file: event-form.tsx:132 ~ useCallback ~ eventData:", eventData)
                Object.keys(eventData).forEach((event) => {
                    if (event !== 'id') {
                        if (eventData[event]) {
                            setValues((prev) => ({
                                ...prev,
                                [event]: eventData[event]
                            }));
                        }
                    }
                })
            }
        }, [mode, eventData])
    );

    useFocusEffect(
        useCallback(() => {
            if (room_id && room_id === -1) {
                setFieldValue('room_id', Number(room_id));
            }
            if (mode === 'create' && start_date !== undefined) {
                setValues((prev) => ({
                    ...prev,
                    start_date
                }));
            }
        }, [mode, start_date, room_id])
    );

    useEffect(() => {
        if (isFocused) {
            StatusBar.setBackgroundColor(statusesColors[values.status]);
        }
        navigation.setOptions({
            headerStyle: {
                backgroundColor: statusesColors[values.status],
            },
            title: values.client.name ? values.client.name : "Book",
            headerRight: () => (
                <IconButton icon="content-save" iconColor={colors.surface} onPress={handleSubmit} />
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
    }, [isFocused, values.client.name, values.status])

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

            const start_date = value;

            // Set start date
            setFieldValue('start_date', start_date);

            // Update end date to one day more than start date
            const endDate = new Date(start_date);
            endDate.setDate(endDate.getDate() + 1);
            setFieldValue('end_date', endDate);

            // Update values in formik directly
            setValues((prevValues) => ({
                ...prevValues,
                start_date: start_date,
                end_date: endDate,
            }));
        },
        [values.start_date],
    )

    console.log(values);

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
                        value={values.client.name}
                        // onBlur={formik.handleBlur('email')}
                        onChangeText={handleChange('client.name')}
                    />
                    <TextInput
                        activeOutlineColor={colors.orangeColor}
                        mode="outlined"
                        label="Phone"
                        // error={!!formik.errors.email}
                        autoComplete="tel"
                        value={values.client.phone}
                        // onBlur={formik.handleBlur('email')}
                        onChangeText={handleChange('client.phone')}
                    />
                    <TextInput
                        activeOutlineColor={colors.orangeColor}
                        mode="outlined"
                        label="Email"
                        // error={!!formik.errors.email}
                        autoComplete="email"
                        value={values.client.email}
                        // onBlur={formik.handleBlur('email')}
                        onChangeText={handleChange('client.email')}
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
                                value={values.client.street}
                                // onBlur={formik.handleBlur('email')}
                                onChangeText={handleChange('client.street')}
                            />
                            <TextInput
                                activeOutlineColor={colors.orangeColor}
                                mode="outlined"
                                label="House number"
                                // error={!!formik.errors.email}
                                autoComplete="address-line2"
                                value={values.client.house_number}
                                // onBlur={formik.handleBlur('email')}
                                onChangeText={handleChange('client.house_number')}
                            />
                            <TextInput
                                activeOutlineColor={colors.orangeColor}
                                mode="outlined"
                                label="Apartment number"
                                // error={!!formik.errors.email}
                                autoComplete="address-line2"
                                value={values.client.apartment_number}
                                // onBlur={formik.handleBlur('email')}
                                onChangeText={handleChange('client.apartment_number')}
                            />
                            <TextInput
                                activeOutlineColor={colors.orangeColor}
                                mode="outlined"
                                label="City"
                                // error={!!formik.errors.email}
                                value={values.client.city}
                                // onBlur={formik.handleBlur('email')}
                                onChangeText={handleChange('client.city')}
                            />
                            <TextInput
                                activeOutlineColor={colors.orangeColor}
                                mode="outlined"
                                label="Country"
                                // error={!!formik.errors.email}
                                value={values.client.country}
                                // onBlur={formik.handleBlur('email')}
                                onChangeText={handleChange('client.country')}
                            />
                            <TextInput
                                activeOutlineColor={colors.orangeColor}
                                mode="outlined"
                                label="Post code"
                                // error={!!formik.errors.email}
                                value={values.client.post_code}
                                // onBlur={formik.handleBlur('email')}
                                onChangeText={handleChange('client.post_code')}
                            />
                            <TextInput
                                activeOutlineColor={colors.orangeColor}
                                mode="outlined"
                                label="Passport"
                                // error={!!formik.errors.email}
                                value={values.client.passport}
                                // onBlur={formik.handleBlur('email')}
                                onChangeText={handleChange('client.passport')}
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
