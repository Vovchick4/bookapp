const pickFields = <T extends Record<string, unknown>>(
    obj: T,
    fields: Array<keyof T>
): Partial<T> => {
    const newObj: Partial<T> = {};
    for (const field of fields) {
        if (obj.hasOwnProperty(field)) {
            newObj[field] = obj[field];
        }
    }
    return newObj;
};

export default pickFields;
