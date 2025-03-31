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
import {
  Coordinate,
  gameDifficulty,
  jigsawBuilderFormSchema,
  JigsawBuilderFormValues,
  Paths,
  pieceCount,
} from "@jigsaw/shared";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useBuilderCreate } from "../api/mutations";

interface BuilderFormProps {
  imageKey: string;
  onPieceQuantityChange: (n: number | undefined) => void;
  paths?: Paths;
  basicGameData: {
    origin: Coordinate;
    pieceSize: number;
    rows: number;
    columns: number;
  };
}

function BuilderForm({
  imageKey,
  onPieceQuantityChange,
  basicGameData,
  paths,
}: BuilderFormProps) {
  const { mutate: buildJigsaw } = useBuilderCreate();

  const { handleSubmit, control, formState } = useForm<JigsawBuilderFormValues>(
    {
      resolver: zodResolver(jigsawBuilderFormSchema),
      defaultValues: {
        difficulty: undefined,
        pieceCount: undefined,
        borders: true,
      },
    }
  );

  const onSubmit: SubmitHandler<JigsawBuilderFormValues> = (data) => {
    // If paths are provided, use them to avoid rebuilding paths (cached option)
    buildJigsaw({
      data: {
        ...data,
        ...basicGameData,
        imageKey: imageKey,
        cached:
          paths?.horizontal && paths.vertical
            ? {
                horizontalPaths: paths.horizontal,
                verticalPaths: paths.vertical,
              }
            : undefined,
      },
    });
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
                {gameDifficulty.map((item) => (
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
            onSelectionChange={(key) => {
              field.onChange(key);
              onPieceQuantityChange(Number(key));
            }}
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

      {/* TODO: Add borders to the puzzle */}
      {/* <Controller
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
      /> */}

      <FormSubmitError error={formState.errors.root?.message} />
      <Button isDisabled={formState.isSubmitting} type="submit">
        Build Puzzle
      </Button>
    </form>
  );
}
export default BuilderForm;
