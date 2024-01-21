import validator from "validator"

export const validatephone = (phone) => {
    let indonesian = /^(\+62|0)[0-9]{8,15}$/;
    if (!validator.isMobilePhone(phone, 'any', { strictMode: false }) || !indonesian.test(phone)) {
        return false;
    }
    return true;
} 