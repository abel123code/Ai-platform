"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowRight,
  Plus,
  Trash2,
} from "lucide-react";
import { courseCategories } from "@/lib/courseCategories";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/component/LoadingSpinner";

const qualificationSchema = z.object({
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
  description: z.string().min(1, "Description is required"),
});

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  contact: z.string().length(8, "Contact number must be 8 digits"),
  qualifications: z
    .array(qualificationSchema)
    .min(1, "At least one qualification is required"),
  experience: z.string().min(1, "Please select your experience level"),
  expertise: z
    .array(z.string())
    .min(1, "Please select at least one area of expertise"),
  description: z.string().min(50, "Description must be at least 50 characters"),
});

export default function TeacherApplicationForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      try {
        const response = await fetch("/api/teacher/status");
        const result = await response.json();

        if (response.status === 401) {
            router.push('/login')
        }

        if (response.ok) {
          setStatus(result.status);
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error("Error fetching application status:", error);
        alert("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationStatus();
  }, []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      qualifications: [{ year: "", description: "" }],
      expertise: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "qualifications",
  });

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/teacher/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Handle success (e.g., show a success message or redirect)
        console.log("Application submitted successfully");
        router.push("/home");
      } else {
        // Handle server errors
        const errorData = await response.json();
        console.error("Error submitting application:", errorData.message);
        setError(errorData.message);
      }
    } catch (error) {
      // Handle network errors
      console.error("Network error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {loading ? (
        <LoadingSpinner />
      ) : status === "Pending" ? (
        <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg flex-col text-center">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Application Pending
          </h2>
          <p className="text-white">
            Your application is currently under review. We will notify you once
            it has been processed.
          </p>
        </div>
      ) : status === "Approved" ? (
        <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Application Approved
          </h2>
          <p className="text-white">Congratulations! Your application has been approved.</p>
        </div>
      ) : status === "Rejected" ? (
        <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg flex-col text-center">
          <h1 className="text-2xl font-bold mb-6 text-white">
            Application Rejected
          </h1>
          <h2 className="text-white text-xl">We're sorry, but your application was not approved at this time.
          Please contact support for more information.</h2>
          <p className="text-white mt-3">
            Please write to us to appeal your application at admin@gmail.com
          </p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Teacher Application Form
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <p className="text-red-500 text-sm mt-1">{error}</p>
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Name
              </label>
              <Input
                id="name"
                {...register("name")}
                className="bg-gray-700 text-white"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="bg-gray-700 text-white"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Contact Number
              </label>
              <Input
                id="contact"
                {...register("contact")}
                className="bg-gray-700 text-white"
              />
              {errors.contact && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contact.message}
                </p>
              )}
            </div>

            {/* Qualifications */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Qualifications or Certifications
              </label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] text-white">Year</TableHead>
                    <TableHead className="text-white">Description</TableHead>
                    <TableHead className="w-[100px] text-white">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <Input
                          {...register(`qualifications.${index}.year`)}
                          placeholder="YYYY"
                          className="bg-gray-700 text-white"
                        />
                        {errors.qualifications?.[index]?.year && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.qualifications[index].year.message}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Input
                          {...register(`qualifications.${index}.description`)}
                          placeholder="Qualification description"
                          className="bg-gray-700 text-white"
                        />
                        {errors.qualifications?.[index]?.description && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.qualifications[index].description.message}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={index === 0}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ year: "", description: "" })}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Qualification
              </Button>
              {errors.qualifications && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.qualifications.message}
                </p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Experience in Teaching
              </label>
              <Controller
                control={control}
                name="experience"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-gray-700 text-white">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent className="bg-white px-2 py-4">
                      <SelectItem value="0-6 months">0-6 months</SelectItem>
                      <SelectItem value="6 months - 1 year">
                        6 months - 1 year
                      </SelectItem>
                      <SelectItem value="1-2 years">1-2 years</SelectItem>
                      <SelectItem value="2-5 years">2-5 years</SelectItem>
                      <SelectItem value="5+ years">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.experience && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Areas of Expertise */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Areas of Expertise
              </label>
              <Controller
                control={control}
                name="expertise"
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-4">
                    {courseCategories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`expertise-${category.id}`}
                          value={category.name}
                          checked={field.value.includes(category.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...field.value, category.name]);
                            } else {
                              field.onChange(
                                field.value.filter((v) => v !== category.name)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={`expertise-${category.id}`}
                          className="text-sm text-gray-300 flex items-center"
                        >
                          {category.icon}
                          <span className="ml-2">{category.name}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              />
              {errors.expertise && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.expertise.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Description
              </label>
              <Textarea
                id="description"
                {...register("description")}
                className="bg-gray-700 text-white"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <span className="flex items-center justify-center">
                  Submitting...
                  <ArrowRight className="ml-2 h-4 w-4 animate-pulse" />
                </span>
              ) : (
                <span className="flex items-center justify-center text-white">
                  Submit Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
