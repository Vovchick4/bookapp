const isEqual = <T1 extends Record<string, unknown>, T2 extends Record<string, unknown>>(obj1: T1, obj2: T2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }

    return true;
};

export default isEqual;