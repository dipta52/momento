import { useField } from "formik";

const InputField = ({
	name,
	label,
	placeholder,
	type,
	autoComplete,
	disabled,
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
		<div>
			<label htmlFor={field.name}>
				<span>{label}</span>
			</label>
			<input
				disabled={disabled}
				{...field}
				type={type}
				autoComplete={autoComplete}
				placeholder={placeholder}
			/>
			{error && touched && <span>Error:{error}</span>}
		</div>
	);
};

InputField.defaultProps = {
	disabled: false,
};

export default InputField;
