import { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import Collapsible from "react-native-collapsible";
import { Text, Button, Surface } from "react-native-paper";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

import { EmployeeForm } from "../components";
import { IUserEntity } from "../types/user.entity";
import useGetQueryEmployees from "../hooks/employees/use-get-query-employees";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";
import useCreateMutateEmployee from "../hooks/employees/use-create-mutate-employee";
import useUpdateMutateEmployee from "../hooks/employees/use-update-mutate-employee";
import useDeleteMutateEmployee from "../hooks/employees/use-delete-mutate-employee";

export default function Employee() {
    const { colors } = useAppTheme();
    const { data, isLoading, isRefetching } = useGetQueryEmployees();
    const { mutate: mutateCreate, isPending: isPendingCreateEmployee } = useCreateMutateEmployee({ onSuccess: () => onEmployeeIdChange(null) });
    const { mutate: mutateUpdate, isPending: isPendingUpdateEmployee } = useUpdateMutateEmployee({ onSuccess: () => onEmployeeIdChange(null) });
    const { mutate: mutateDelete, isPending: isPendingDeleteEmployee } = useDeleteMutateEmployee();
    const [editData, setEditData] = useState<IUserEntity | null>(null);
    const [employeeId, setEmployeeId] = useState<number | string | null>(null);

    function onEmployeeIdChange(id: number | string | null) {
        setEmployeeId(id);
    }

    return (
        <Surface style={{ flex: 1, padding: 20 }}>
            <View style={{ alignItems: 'center', rowGap: 5 }}>
                <Text style={{ fontSize: 17 }}>Працівники</Text>
                <Collapsible collapsed={!!employeeId}>
                    <Button
                        mode="outlined"
                        textColor={colors.orangeColor}
                        loading={isLoading || isRefetching || isPendingDeleteEmployee}
                        disabled={isLoading || isRefetching || isPendingDeleteEmployee}
                        icon="account-multiple-plus-outline"
                        onPress={() => onEmployeeIdChange(-1)}
                    >
                        Добавивти працівника
                    </Button>
                </Collapsible>
            </View>
            <ScrollView>
                <Collapsible collapsed={!!employeeId}>
                    <View style={{ rowGap: 20, marginTop: 15 }}>
                        {!isLoading && data && data.length > 0 &&
                            data.map((dt) => (
                                <View
                                    key={dt.id}
                                    style={{
                                        paddingHorizontal: 20,
                                        paddingVertical: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        elevation: 2,
                                        borderRadius: 5,
                                    }}
                                >
                                    <FontAwesome name="user-circle-o" size={50} color={colors.orangeColor} />
                                    <View>
                                        <Text numberOfLines={1}>{dt.name}</Text>
                                        <Text numberOfLines={1}>{dt.email}</Text>
                                        <View style={{ marginTop: 15, columnGap: 10, flexDirection: 'row' }}>
                                            <Button
                                                mode='outlined'
                                                loading={isPendingDeleteEmployee}
                                                disabled={isPendingDeleteEmployee}
                                                onPress={() => {
                                                    setEditData(dt)
                                                    setEmployeeId(dt.id);
                                                }}
                                            >
                                                <AntDesign name="edit" size={22} color={colors.orangeColor} />
                                            </Button>
                                            <Button
                                                mode='outlined'
                                                loading={isPendingDeleteEmployee}
                                                disabled={isPendingDeleteEmployee}
                                                onPress={() => {
                                                    Alert.alert(
                                                        'Видалення',
                                                        'Ви точно хочете видалити працівника?',
                                                        [
                                                            {
                                                                text: 'Ні', // Button text
                                                            },
                                                            {
                                                                text: 'Taк', // Button text
                                                                onPress: () => mutateDelete(dt.id),
                                                            },
                                                        ],
                                                    )
                                                }}
                                            >
                                                <AntDesign name="delete" size={22} color={colors.orangeColor} />
                                            </Button>
                                        </View>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                </Collapsible>

                <Collapsible collapsed={!employeeId}>
                    <EmployeeForm
                        editData={editData}
                        activeId={employeeId}
                        onSubmit={(data) => {
                            if (employeeId === -1 || employeeId === null) {
                                mutateCreate(data);
                            } else {
                                mutateUpdate({ data, id: employeeId });
                            }
                        }}
                        onEmployeeIdChange={onEmployeeIdChange}
                        isMutating={isPendingCreateEmployee || isPendingUpdateEmployee}
                    />
                </Collapsible>
            </ScrollView>
        </Surface>
    )
}
