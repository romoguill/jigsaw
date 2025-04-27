import { FieldValues, FormState } from "react-hook-form";

interface FormSubmitErrorProps<T extends FieldValues> {
  errorState: FormState<T>["errors"];
  name: keyof T;
}

function FormFieldError<T extends FieldValues>({
  errorState,
  name,
}: FormSubmitErrorProps<T>) {
  return (
    <p className="text-red-400 text-sm">
      {errorState[name]?.message?.toString() ?? ""}
    </p>
  );
}
export default FormFieldError;
