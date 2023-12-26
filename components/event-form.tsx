import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import { StatusBar, View } from "react-native";
import { DatePickerInput } from 'react-native-paper-dates';
import DropDown from "react-native-paper-dropdown";
import { Button, Icon, IconButton, List, RadioButton, Surface, Text, TextInput } from "react-native-paper";
import { EventStatus } from "../types/event";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";
import Collapsible from "react-native-collapsible";
import { differenceInCalendarDays, differenceInDays, parseISO } from "date-fns";
import { toDate } from "date-fns-tz";
import { useNavigation } from "@react-navigation/native";

interface Props {
    mode?: string;
    eventData: any
    onSubmit: (data: any) => void;
}

const dropStates = {
    parent: 'parent',
    children: 'children',
}

const twentyElements = Array.from({ length: 20 }, (_, index) => ({ label: index + 1 + "", value: index + 1 }));

export default function EventForm({ mode, eventData, onSubmit }: Props) {
    const { colors } = useAppTheme();
    const navigation = useNavigation();
    const [expanded, setExpanded] = useState(true);
    const [dropsListState, setDropsListState] = useState<string | null>(null);
    const { values, setValues, setFieldValue, resetForm, handleChange, handleSubmit } = useFormik({
        initialValues: {
            start_date: eventData.startDate ? eventData.startDate : '',
            end_date: mode === "update" ? eventData.endDate : '',
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
            notes: ''
        },
        onSubmit
    });

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

    useEffect(() => {
        setFieldValue('start_date', eventData.startDate || '');

        if (mode === 'update') {
            setFieldValue('end_date', eventData.endDate || '');
        } else {
            setFieldValue('room_id', eventData.roomId);
        }
    }, [mode, eventData.startDate, eventData.endDate, eventData.roomId])

    useEffect(() => {
        StatusBar.setBackgroundColor(statusesColors[values.status]);
        navigation.setOptions({
            headerStyle: {
                backgroundColor: statusesColors[values.status],
            },
            title: values.client.name ? values.client.name + " - " + eventData.roomName : eventData.roomName || "Create book",
            headerRight: () => (
                <IconButton icon="content-save" onPress={handleSubmit} />
            ),
            headerLeft: () => (
                <IconButton icon="keyboard-backspace" iconColor={colors.surface} size={28} onPress={() => {
                    resetForm();
                    setFieldValue('start_date', '');
                    setFieldValue('parents', 0);
                    setFieldValue('childrens', 0);
                    StatusBar.setBackgroundColor(colors.menuColor);
                    navigation.goBack()
                }} />
            ),
        });

        return () => {
            navigation.setOptions({ title: "Create book" });
        }
    }, [eventData.roomId, eventData.roomName, values.client.name, values.status])

    // Inside your component

    useEffect(() => {
        // Calculate price per day whenever price_per_person or the number of people changes
        const pricePerDay = (values.parents + values.childrens) * values.price_per_person;
        setFieldValue('price_per_day', pricePerDay);
    }, [values.parents, values.childrens, values.price_per_person]);

    useEffect(() => {
        if (values.start_date && values.end_date) {
            const daysDifference = differenceInDays(values.end_date, values.start_date);
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

            const startDate = value;

            // Set start date
            setFieldValue('start_date', startDate);

            // Update end date to one day more than start date
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1);
            setFieldValue('end_date', endDate);

            // Update values in formik directly
            setValues((prevValues) => ({
                ...prevValues,
                start_date: startDate,
                end_date: endDate,
            }));
        },
        [values.start_date],
    )

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
                    defaultValue={(new Date(values.start_date).getDate() + 1).toString()}
                />
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
