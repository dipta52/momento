import { TextField } from "@mui/material";
import { useField } from "formik";

const InputField = ({
  name,
  label,
  placeholder,
  type,
  autoComplete,
  disabled,
  size,
}) => {
  const [field, { error, touched }] = useField({
    name,
    label,
    placeholder,
    type,
    autoComplete,
    disabled,
  });
  return (
    <TextField
      type={type}
      fullWidth
      margin="normal"
      sx={{ width: "100%" }}
      name={field.name}
      label={label}
      value={field.value}
      onChange={field.onChange}
      error={touched && Boolean(error)}
      helperText={touched && error}
      size={size}
    />
  );
};

InputField.defaultProps = {
  disabled: false,
  size: "normal",
};

export default InputField;
