import FormFieldError from "@/components/global/forms/form-field-error";
import { FormSubmitError } from "@/components/global/forms/form-submit-error";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/field";
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
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  difficulty: z
    .enum(difficulty, { message: "Invalid option" })
    .or(z.literal(""))
    .refine((val) => val.length > 0, "Must select an option"),
  pieceCount: z
    .enum(pieceCount, { message: "Invalid option" })
    .or(z.literal(""))
    .refine((val) => val.length > 0, "Must select an option"),
  borders: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

function BuilderForm() {
  const { handleSubmit, control, formState, getValues } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      difficulty: "",
      pieceCount: "",
      borders: true,
    },
  });
  console.log(getValues());
  console.log(formState);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 flex flex-col gap-5"
    >
      <Controller
        control={control}
        name="difficulty"
        render={({ field }) => (
          <Select
            {...field}
            selectedKey={field.value}
            onSelectionChange={(key) => field.onChange(key)}
          >
            <Label>Difficulty</Label>
            <SelectTrigger>
              <SelectValue className="capitalize" />
            </SelectTrigger>

            <SelectPopover>
              <SelectListBox>
                {difficulty.map((item) => (
                  <SelectItem key={item} id={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectListBox>
            </SelectPopover>

            <FormFieldError errorState={formState.errors} name="difficulty" />
          </Select>
        )}
      />

      <Controller
        control={control}
        name="pieceCount"
        render={({ field }) => (
          <Select
            {...field}
            selectedKey={field.value}
            onSelectionChange={(key) => field.onChange(key)}
          >
            <Label>Piece Count</Label>
            <SelectTrigger>
              <SelectValue className="capitalize" />
            </SelectTrigger>

            <SelectPopover>
              <SelectListBox>
                {pieceCount.map((item) => (
                  <SelectItem key={item} id={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectListBox>
            </SelectPopover>

            <FormFieldError errorState={formState.errors} name="pieceCount" />
          </Select>
        )}
      />

      <Controller
        control={control}
        name="borders"
        render={({ field }) => (
          <Switch
            {...field}
            value={String(field.value)}
            isSelected={field.value}
            onChange={field.onChange}
          >
            <Label>with borders (edge pieces)</Label>
          </Switch>
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
