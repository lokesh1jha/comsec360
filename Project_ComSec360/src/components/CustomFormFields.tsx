"use client";
import {
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "./ui/form";
import { useState } from "react";
import { NatureOfBusinessContent } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import type { Control } from "react-hook-form";
import { PhoneInput } from "./ui/phone-input";
import { Check, ChevronsUpDown } from "lucide-react";
import { getCurrentDate } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface BaseProps {
  name: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  control: Control<any>;
  hoverCard?: React.ReactNode;
}

interface CustomProps extends BaseProps {
  label?: string;
  placeholder: string;
  readOnly?: boolean;
  type?: string;
}

interface CustomCheckboxProps extends BaseProps {
  label?: string;
  value1: string;
  value2: string;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const PresentorsReferenceField = ({ form }: { form: any }) => (
  <FormField
    name="presentorReferance"
    control={form.control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>Presentor&lsquo;s Referance:</FormLabel>
        <FormControl>
          <Input
            placeholder="Eg: CompanyName-NNC1-06-03-2024"
            {...field}
            value={`${form.getValues("name")}-NNC1-${getCurrentDate()}`}
            readOnly
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const CustomCheckboxField = ({
  name,
  label,
  value1,
  value2,
  control,
  hoverCard,
}: CustomCheckboxProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel className="inline-flex items-center gap-2">
              <span>{label}</span>
              {hoverCard && hoverCard}
            </FormLabel>
          )}
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex justify-start items-center gap-10"
            >
              <FormItem className="flex items-end space-x-3">
                <FormControl>
                  <RadioGroupItem value={value1} />
                </FormControl>
                <FormLabel className="font-normal capitalize">
                  {value1}
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-end space-x-3">
                <FormControl>
                  <RadioGroupItem
                    value={value2}
                    disabled={value2 === "public"}
                  />
                </FormControl>
                <FormLabel className="font-normal text-muted-foreground capitalize">
                  {value2}
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const CustomNatureOfBusinessField = ({ form }: { form: any }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [filteredContent, setFilteredContent] = useState(
    NatureOfBusinessContent,
  );
  const onCommandInputChange = (event: string) => {
    const value = event.toLowerCase();
    const filtered = NatureOfBusinessContent.filter((item) =>
      item.value.toLowerCase().includes(value),
    );
    setFilteredContent(filtered);
  };
  return (
    <FormField
      name="nature"
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nature of Business</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "md:w-[450px] w-auto h-auto justify-between text-pretty",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value ? field.value : " Select Nature of Business"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="md:w-[450px] w-auto">
              <Command>
                <CommandInput
                  placeholder="Search Nature of Business..."
                  onValueChange={(currentValue) =>
                    onCommandInputChange(currentValue)
                  }
                />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {filteredContent.map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          form.setValue("nature", item.value);
                          form.setValue("code", item.code);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === item.value ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {item.value}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const CustomFormField = ({
  name,
  control,
  label,
  placeholder,
  readOnly = false,
  type,
  hoverCard,
}: CustomProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel className="inline-flex items-center gap-2">
              <span>{label}</span>
              {hoverCard && hoverCard}
            </FormLabel>
          )}
          <FormControl>
            {name === "presentorTel" ||
            name === "presentorFax" ||
            name === "companyFax" ||
            name === "companyTel" ? (
              <PhoneInput
                placeholder={placeholder}
                defaultCountry="HK"
                {...field}
              />
            ) : (
              <Input
                placeholder={placeholder}
                type={type}
                readOnly={readOnly}
                {...field}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
