//@ts-ignore
const configComponentStyle = colors => ({
    Input: {
        borderColor: colors.border,
        background: '#FFFFFF',
        readOnlyBackground: '#CCC',
        readOnlyBorderColor: '#DDD',
        placeholderColor: '#AAA',
        color: colors.N800,
        focusBorderColor: colors.B500,
        size: {
            sm: '2rem',
            md: '3rem',
            lg: '4rem',
        },
    },
    Checkbox: {
        color: {
            primary: colors.primary,
            danger: colors.warning,
            success: colors.success,
            warning: colors.warning,
        },
    },
});

export default configComponentStyle;
