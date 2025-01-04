"use client";

import { useState } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseCategories } from "@/lib/courseCategories";
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
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Video } from 'lucide-react';

const lessonSchema = z.object({
  lessonTitle: z.string().min(1, "Lesson title is required"),
  duration: z.string().optional(),
  description: z.string().optional(),
  videoURL: z.string().url('Invalid URL').optional(), 
});

const moduleSchema = z.object({
  moduleTitle: z.string().min(1, "Module title is required"),
  lessons: z.array(lessonSchema).min(1, "At least one lesson is required"),
});

const courseFormSchema = z.object({
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  courseTitle: z.string().min(1, "Course title is required"),
  courseDescription: z.string().min(1, "Course description is required"),
  whatYouWillLearn: z
    .array(z.string().min(1, "This field is required"))
    .min(1, "At least one item is required"),
  modules: z.array(moduleSchema).min(1, "At least one module is required"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, "Price must be a positive number"),
});

export default function AddCourseForm() {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      category: "",
      subcategory: "",
      courseTitle: "",
      courseDescription: "",
      whatYouWillLearn: [""],
      modules: [
        {
          moduleTitle: "",
          lessons: [{ lessonTitle: "", duration: "", description: "" }],
        },
      ],
      price: "",
    },
  });

  const {
    fields: whatYouWillLearnFields,
    append: appendWhatYouWillLearn,
    remove: removeWhatYouWillLearn,
  } = useFieldArray({
    control,
    name: "whatYouWillLearn",
  });

  const {
    fields: moduleFields,
    append: appendModule,
    remove: removeModule,
  } = useFieldArray({
    control,
    name: "modules",
  });

  const onSubmit = async (data) => {
    // Process data (e.g., send to API)
    console.log("Form Data:", data);

    try {
      const response = await fetch("/api/teacher/create-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Redirect or show success message
        router.push("/instructor/my-course");
      } else {
        // Handle server errors
        const errorData = await response.json();
        console.error("Error submitting course:", errorData.message);
      }
    } catch (error) {
      // Handle network errors
      console.error("Network error:", error);
    }
  };

  return (
    <Card className="bg-gray-800 text-gray-100">
      <CardHeader>
        <CardTitle className='flex flex-col justify-center items-center gap-2'>
            <Video size={40} />
            Create your course
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-gray-700 text-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    {courseCategories.map((category) => (
                      <SelectItem key={category.id} value={category.route} className='py-2 px-3'>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Subcategory */}
          <div>
            <Label htmlFor="subcategory">Subcategory</Label>
            <Input
              id="subcategory"
              {...register("subcategory")}
              className="bg-gray-700 text-white"
            />
            {errors.subcategory && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subcategory.message}
              </p>
            )}
          </div>

          {/* Course Title */}
          <div>
            <Label htmlFor="courseTitle">Course Title</Label>
            <Input
              id="courseTitle"
              {...register("courseTitle")}
              className="bg-gray-700 text-white"
            />
            {errors.courseTitle && (
              <p className="text-red-500 text-sm mt-1">
                {errors.courseTitle.message}
              </p>
            )}
          </div>

          {/* Course Description */}
          <div>
            <Label htmlFor="courseDescription">Course Description</Label>
            <Textarea
              id="courseDescription"
              {...register("courseDescription")}
              className="bg-gray-700 text-white"
            />
            {errors.courseDescription && (
              <p className="text-red-500 text-sm mt-1">
                {errors.courseDescription.message}
              </p>
            )}
          </div>

          {/* What You'll Learn */}
          <div className="flex flex-col justify-center">
            <Label>Key Skills Students Will Learn</Label>
            {whatYouWillLearnFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mb-2">
                <Input
                  {...register(`whatYouWillLearn.${index}`)}
                  className="bg-gray-700 text-white flex-1"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className='text-red-600 font-semibold'
                  onClick={() => removeWhatYouWillLearn(index)}
                  disabled={whatYouWillLearnFields.length === 1}
                >
                  ✕
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className='text-black w-1/3'
              onClick={() => appendWhatYouWillLearn("")}
            >
              + Add Item
            </Button>
            {errors.whatYouWillLearn && (
              <p className="text-red-500 text-sm mt-1">
                {errors.whatYouWillLearn.message}
              </p>
            )}
          </div>

          {/* Modules and Lessons */}
          <div>
            <Label>Modules</Label>
            {moduleFields.map((module, moduleIndex) => (
              <div key={module.id} className="border p-4 mb-4">
                {/* Module Title */}
                <div className="flex items-center space-x-2 mb-2">
                  <Input
                    {...register(`modules.${moduleIndex}.moduleTitle`)}
                    placeholder="Module Title"
                    className="bg-gray-700 text-white flex-1"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeModule(moduleIndex)}
                    disabled={moduleFields.length === 1}
                  >
                    ✕
                  </Button>
                </div>
                {errors.modules?.[moduleIndex]?.moduleTitle && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.modules[moduleIndex].moduleTitle.message}
                  </p>
                )}

                {/* Lessons */}
                <div className="ml-4">
                  <Label>Lessons</Label>
                  <LessonFields
                    nestIndex={moduleIndex}
                    {...{ control, register, errors }}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className='text-black'
              size="sm"
              onClick={() =>
                appendModule({
                  moduleTitle: "",
                  lessons: [{ lessonTitle: "", duration: "", description: "" }],
                })
              }
            >
              + Add Module
            </Button>
            {errors.modules && (
              <p className="text-red-500 text-sm mt-1">
                {errors.modules.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className="bg-gray-700 text-white w-1/4"
              placeholder='$12.99'
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-[50%] bg-slate-50 text-black mx-auto">
            Submit Course
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Component to handle lessons within modules
function LessonFields({ nestIndex, control, register, errors }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `modules.${nestIndex}.lessons`,
  });

  return (
    <div>
        {fields.map((field, k) => (
            <div key={field.id} className="flex flex-col mb-2">
            <div className="flex items-center space-x-2 mb-1">
                <Input
                    {...register(
                        `modules.${nestIndex}.lessons.${k}.lessonTitle`
                    )}
                    placeholder="Lesson Title"
                    className="bg-gray-700 text-white flex-1"
                />
                <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(k)}
                    disabled={fields.length === 1}
                    >
                    ✕
                </Button>
            </div>
            {errors.modules?.[nestIndex]?.lessons?.[k]?.lessonTitle && (
                <p className="text-red-500 text-sm mt-1">
                {
                    errors.modules[nestIndex].lessons[k].lessonTitle
                    .message
                }
                </p>
            )}

            <Input
                {...register(`modules.${nestIndex}.lessons.${k}.duration`)}
                placeholder="Duration (e.g., 10 min)"
                className="bg-gray-700 text-white mb-1"
            />
            <Input
                {...register(`modules.${nestIndex}.lessons.${k}.videoURL`)}
                placeholder="Video URL"
                className="bg-gray-700 text-white mb-1"
            />
            {errors.modules?.[nestIndex]?.lessons?.[k]?.videoURL && (
            <p className="text-red-500 text-sm mt-1">
                {errors.modules[nestIndex].lessons[k].videoURL.message}
            </p>
            )}
            <Textarea
                {...register(`modules.${nestIndex}.lessons.${k}.description`)}
                placeholder="Lesson Description"
                className="bg-gray-700 text-white"
            />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className='text-black'
        size="sm"
        onClick={() =>
          append({ lessonTitle: "", duration: "", description: "" })
        }
      >
        + Add Lesson
      </Button>
    </div>
  );
}
