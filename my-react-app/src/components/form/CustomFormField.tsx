import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";


interface FormFieldProps<TFieldValues extends FieldValues> {
    form: UseFormReturn<TFieldValues>;
    name: FieldPath<TFieldValues>;
    label: string;
    required?: boolean;
    description?: string;
    options?: any[];
    renderInput: (field: any) => React.ReactNode;
}

export const CustomFormField = <TFieldValues extends FieldValues>({
    form,
    name,
    label,
    required,
    description,
    renderInput,
}: FormFieldProps<TFieldValues>) => {
    return (
        <FormField<TFieldValues>
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="grid gap-3">
                    <FormLabel>
                        {label}
                        {required && <span className="text-red-500"> *</span>}
                    </FormLabel>
                    <FormControl>
                        {renderInput(field)}
                    </FormControl>
                    {description &&
                        <FormDescription>
                            {description}
                        </FormDescription>
                    }
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}