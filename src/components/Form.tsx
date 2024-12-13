import React from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import DatePicker from "react-datepicker";
import simulatedApi from "../api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  firstName: z.string().min(1, "First Name is Required"),
  lastName: z.string().min(1, "Last Name is Required"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "You must be at leat 18 years old"),
  gender: z.enum(["male", "female"], {
    message: "Gender is Required",
  }),
  address: z.object({
    city: z.string().min(1, "City is Required"),
    state: z.string().min(1, "State is Required"),
  }),
  hobbies: z
    .array(
      z.object({
        name: z.string().min(1, "Hobby name is required"),
      })
    )
    .min(1, "At least one hobby is required"),
  startDate: z.date(),
  subscribe: z.boolean(),
  referral: z.string().default(""),
});

type FormData = z.infer<typeof formSchema>;

const Form: React.FC = () => {
  const {
    register,
    control,
    reset,
    getValues,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: 18,
      gender: undefined,
      address: { city: "", state: "" },
      hobbies: [{ name: "" }],
      startDate: new Date(),
      subscribe: false,
      referral: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "hobbies",
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await simulatedApi(data);
      console.log("Success", response.data);
    } catch (error: any) {
      setError("root", {
        message: error.message,
      });
    }
  };

  React.useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input id="firstName" {...register("firstName")} />
        {errors.firstName && (
          <p style={{ color: "orangered" }}>{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="lastName">Last Name</label>
        <input id="lastName" {...register("lastName")} />
        {errors.lastName && (
          <p style={{ color: "orangered" }}>{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" {...register("email")} />
        {errors.email && (
          <p style={{ color: "orangered" }}>{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="age">Age</label>
        <input id="age" {...register("age", { valueAsNumber: true })} />
        {errors.age && (
          <p style={{ color: "orangered" }}>{errors.age.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="gender">Gender</label>
        <select id="gender" {...register("gender")}>
          <option value="">Select...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {errors.gender && (
          <p style={{ color: "orangered" }}>{errors.gender.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="address">Address</label>
        <input id="address" {...register("address.city")} placeholder="City" />
        {errors.address?.city && (
          <p style={{ color: "orangered" }}>{errors.address.city.message}</p>
        )}

        <input
          id="address"
          placeholder="State"
          {...register("address.state")}
        />
        {errors.address?.state && (
          <p style={{ color: "orangered" }}>{errors.address.state.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="StartDate">Start Date</label>
        <Controller
          control={control}
          name="startDate"
          render={({ field }) => (
            <DatePicker
              placeholderText="Select date"
              selected={field.value}
              onChange={(date: Date | null) => field.onChange(date)}
            />
          )}
        />
      </div>

      <div>
        <label>Hobbies</label>
        {fields.map((item, index) => (
          <div key={item.id}>
            <input
              {...register(`hobbies.${index}.name`)}
              placeholder="Hobby Name"
            />
            {errors.hobbies?.[index]?.name && (
              <p style={{ color: "orangered" }}>
                {errors.hobbies[index].name.message}
              </p>
            )}

            {fields.length > 1 && (
              <button type="button" onClick={() => remove(index)}>
                Remove Hobby
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => append({ name: "" })}>
          Add Hobby
        </button>
      </div>

      <div>
        <label htmlFor="subscribe">Subscribe to our Newsletter</label>
        <input type="checkbox" id="subscribe" {...register("subscribe")} />
      </div>

      {getValues("subscribe") && (
        <div>
          <label htmlFor="referral">Referral Source</label>
          <input
            id="referral"
            {...register("referral")}
            placeholder="How did you hear about us?"
          />
          {errors.referral && (
            <p style={{ color: "orangered" }}>{errors.referral.message}</p>
          )}
        </div>
      )}

      {errors.root && (
        <p style={{ color: "orangered" }}>{errors.root.message}</p>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting" : "Submit"}
      </button>
    </form>
  );
};

export default Form;
