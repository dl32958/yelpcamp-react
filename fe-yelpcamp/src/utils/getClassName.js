export const getClassName = (fieldError, additionalClasses="") => {
    return fieldError ? `form-control is-invalid ${additionalClasses}` : `form-control ${additionalClasses}`;
};