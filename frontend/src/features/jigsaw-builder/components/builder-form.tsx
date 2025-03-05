import { Button } from "@/components/ui/button";
import { FieldError, Label } from "@/components/ui/field";
import {
  Select,
  SelectItem,
  SelectListBox,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { difficulty, pieceCount } from "../../../../../server/shared/types";
import { FormSubmitError } from "@/components/global/form-submit-error";

const formSchema = z.object({
  difficulty: z.enum(difficulty),
  pieceCount: z.enum(pieceCount),
});

type FormValues = z.infer<typeof formSchema>;

function BuilderForm() {
  const { handleSubmit, control, formState, getValues } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      difficulty: "",
      pieceCount: "",
    },
  });
  console.log(getValues());
  console.log(formState);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="difficulty"
        render={({ field }) => (
          <Select
            selectedKey={field.value}
            onSelectionChange={(key) => field.onChange(key)}
          >
            <Label>Difficulty</Label>
            <SelectTrigger>
              <SelectValue className="capitalize" />
            </SelectTrigger>

            <FieldError>{formState.errors.difficulty?.message}</FieldError>
            <SelectPopover>
              <SelectListBox>
                {difficulty.map((item) => (
                  <SelectItem key={item} id={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectListBox>
            </SelectPopover>
          </Select>
        )}
      />

      <Controller
        control={control}
        name="pieceCount"
        render={({ field }) => (
          <Select
            selectedKey={field.value}
            onSelectionChange={(key) => field.onChange(key)}
          >
            <Label>Piece Count</Label>
            <SelectTrigger>
              <SelectValue className="capitalize" />
            </SelectTrigger>

            <FieldError>{formState.errors.pieceCount?.message}</FieldError>
            <p>{formState.errors.pieceCount?.message}</p>
            <SelectPopover>
              <SelectListBox>
                {pieceCount.map((item) => (
                  <SelectItem key={item} id={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectListBox>
            </SelectPopover>
          </Select>
        )}
      />

      <FormSubmitError error={formState.errors.root?.message} />
      <Button isDisabled={formState.isSubmitting} type="submit">
        Build Puzzle
      </Button>
    </form>
  );
}
export default BuilderForm;
