import React from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { FormData } from "../types/form";
import DatePicker from "react-datepicker";
import simulatedApi from "../api";

const Form: React.FC = () => {
  const {
    register,
    control,
    getValues,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: 18,
      gender: "",
      address: { city: "", state: "" },
      hobbies: [{ name: "" }],
      startDate: new Date(),
      subscribe: false,
      referral: "",
    },
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          {...register("firstName", {
            required: "First Name is required",
          })}
        />
        {errors.firstName && (
          <p style={{ color: "orangered" }}>{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          {...register("lastName", {
            required: "Last Name is required",
          })}
        />
        {errors.lastName && (
          <p style={{ color: "orangered" }}>{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
          })}
        />
        {errors.email && (
          <p style={{ color: "orangered" }}>{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          {...register("age", {
            required: "Age is required",
            min: { value: 18, message: "You must be at least 18 years old" },
          })}
        />
        {errors.age && (
          <p style={{ color: "orangered" }}>{errors.age.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
          {...register("gender", {
            required: "Gender is required",
          })}
        >
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
        <input
          id="address"
          {...register("address.city", {
            required: "City is required",
          })}
          placeholder="City"
        />
        {errors.address?.city && (
          <p style={{ color: "orangered" }}>{errors.address.city.message}</p>
        )}

        <input
          id="address"
          placeholder="State"
          {...register("address.state", {
            required: "State is required",
          })}
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
              {...register(`hobbies.${index}.name`, {
                required: "Hobby name is required",
              })}
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
            {...register("referral", {
              required: "Referral source is required if subscribing",
            })}
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
