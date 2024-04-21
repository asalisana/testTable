// validation.js

export const validateRequired = (value) => !!value.length;

export function validateDateFormat(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
}

export function validateUser(user) {
    return {
        insert_user: !validateRequired(user.insert_user)
            ? 'Обязательное поле'
            : '',
        org_employee: !validateRequired(user.org_employee)
            ? 'Обязательное поле'
            : '',
        rep_beg_period: !validateDateFormat(user.rep_beg_period)
            ? 'Формат даты должен быть YYYY-MM-DD'
            : '',
        update_date: !validateDateFormat(user.rep_beg_period)
            ? 'Формат даты должен быть YYYY-MM-DD'
            : '',
        update_user: !validateRequired(user.update_user)
            ? 'Обязательное поле'
            : '',
    };
}
