interface FormSubmitErrorProps {
  error: string | undefined;
}

export function FormSubmitError({ error }: FormSubmitErrorProps) {
  return <p className="text-red-400">{error}</p>;
}
