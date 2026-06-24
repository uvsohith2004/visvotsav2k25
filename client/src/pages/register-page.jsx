import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  SquareChartGantt,
  Ticket,
  Users,
  User,
  CheckIcon,
  Edit3,
  Loader2,
} from "lucide-react";
import {
  branches,
  events,
  projectTypeOptions,
  formSchema,
  colleges,
} from "@/constants";

import { useFormSubmit } from "@/hooks/submit";
import ConfettiPopup from "@/components/submit-popup";
const RegisterPage = () => {

  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState("Technical");
  const mutation = useFormSubmit();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      college: "",
      customCollege: "",
      eventType: "Technical",
      event: "",
      branch: "",
      duNumber: "",
      confirmDuNumber: "",
      participants: "",
      termsAccepted: false,
      participantDetails: [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (mutation.isSuccess) {
      form.reset();
      setStep(1);
      setEventType("Technical");
    }
  }, [mutation.isSuccess, form]);
  const steps = [
    { title: "Personal Information", icon: User },
    { title: "Event Selection", icon: SquareChartGantt },
    { title: "DU Number", icon: Ticket },
    { title: "Participants", icon: Users },
    { title: "Review & Submit", icon: Edit3 },
  ];

  const onSubmit = async (data) => {
    if (step < 5) {
      handleNext();
      return;
    }
    console.log("Submitting form data:", data);
    mutation.mutate(data);
  };
  const isStepValid = () => {
    switch (step) {
      case 1: {
        // Step 1: Check if name, phone, and email are valid
        const fields = ["name", "phone", "email", "college"];
        if (form.getValues("college") === "Other") {
          fields.push("customCollege");
        }
        return fields.every((field) => !form.getFieldState(field).invalid);
      }

      case 2: {
        // Step 2: Check if event and branch are valid
        const fields = ["event", "branch"];
        return fields.every((field) => {
          const fieldState = form.getFieldState(field);
          return fieldState.isDirty && !fieldState.invalid;
        });
      }

      case 3: {
        // Step 3: Check if duNumber and confirmDuNumber are valid and match
        const duNumberState = form.getFieldState("duNumber");
        const confirmDuNumberState = form.getFieldState("confirmDuNumber");
        const isValid =
          duNumberState.isDirty &&
          !duNumberState.invalid &&
          confirmDuNumberState.isDirty &&
          !confirmDuNumberState.invalid;
        const doNumbersMatch =
          duNumberState.value === confirmDuNumberState.value;
        return isValid && doNumbersMatch;
      }

      case 4: {
        const participantsCount = parseInt(form.getValues("participants"));

        if (isNaN(participantsCount) || participantsCount < 0) {
          return false;
        }

        if (participantsCount === 0) {
          return true;
        }

        const isRadioSelected =
          form.getFieldState("participants").isDirty &&
          !form.getFieldState("participants").invalid;

        const areParticipantDetailsValid = [...Array(participantsCount)].every(
          (_, index) => {
            const nameState = form.getFieldState(
              `participantDetails.${index}.name`
            );
            return nameState.isDirty && !nameState.invalid;
          }
        );

        return isRadioSelected && areParticipantDetailsValid;
      }
      case 5:
        return (
          form.getFieldState("termsAccepted").isDirty &&
          !form.getFieldState("termsAccepted").invalid
        );
      default:
        return false;
    }
  };

  const handleNext = async () => {
    const isValid = await form.trigger(
      step === 1
        ? ["name", "phone", "email"]
        : step === 2
        ? ["event", "branch"]
        : step === 3
        ? ["duNumber", "confirmDuNumber"]
        : step === 4
        ? ["participants"]
        : []
    );

    if (isValid) {
      setStep((prevStep) => prevStep + 1);
    }
  };
  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleEventTypeChange = (value) => {
    setEventType(value);
    form.setValue("event", "");
  };

  const handleEventChange = () => {
    form.setValue("participants", "");
  };

  const handleEditStep = (stepNumber) => {
    setStep(stepNumber);
  };

  const getFormData = () => {
    const data = form.getValues();
    return {
      ...data,
      college: data.college === "Other" ? data.customCollege : data.college,
    };
  };
  const watchedEvent = form.watch("event");
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex pt-20 p-4 flex-col gap-4">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl">
        <CardHeader className="bg-primary text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold mb-5">
            {steps[step - 1].title}
          </CardTitle>
          <div className="flex justify-between items-center mt-4">
            {steps.map((s, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl cursor-pointer transition-all
                    ${
                      index + 1 < step
                        ? "bg-green-500 hover:bg-green-600"
                        : index + 1 === step
                        ? "bg-white text-primary ring ring-green-500"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                  onClick={() => index + 1 < step && handleEditStep(index + 1)}
                >
                  {index + 1 < step ? (
                    <CheckIcon className="w-6 h-6" />
                  ) : (
                    React.createElement(s.icon, { className: "w-5 h-5" })
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 1 && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="relative">
                            <FormControl>
                              <Input
                                placeholder=""
                                {...field}
                                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-800 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:border-primary peer"
                              />
                            </FormControl>
                            <FormLabel className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/4 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-6 start-1">
                              Full Name
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="relative">
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-[14px] text-sm text-gray-600 z-20">
                                  +91
                                </span>
                                <Input
                                  placeholder=""
                                  {...field}
                                  className="block pl-12 pb-2.5 pt-4 w-full text-sm text-gray-800 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:border-primary peer"
                                />
                              </div>
                            </FormControl>
                            <FormLabel className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/4 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-6 start-1">
                              Phone Number
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="relative">
                            <FormControl>
                              <Input
                                placeholder=""
                                type="email"
                                {...field}
                                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-800 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:border-primary peer"
                              />
                            </FormControl>
                            <FormLabel className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/4 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-6 start-1">
                              Email Address
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="college"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>College/University</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your college" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {colleges.map((college) => (
                                  <SelectItem key={college} value={college}>
                                    {college}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {form.watch("college") === "Other" && (
                        <FormField
                          control={form.control}
                          name="customCollege"
                          render={({ field }) => (
                            <FormItem className="relative">
                              <FormControl>
                                <Input
                                  placeholder=""
                                  {...field}
                                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-800 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:border-primary peer"
                                />
                              </FormControl>
                              <FormLabel className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/4 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-6 start-1">
                                Enter College Name
                              </FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      {Object.keys(events).length > 1 && (
                        <FormField
                          control={form.control}
                          name="eventType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Event Category</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  handleEventTypeChange(value);
                                }}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select event category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.keys(events).map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type} Events
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="event"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Event</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleEventChange();
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose an event" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {events[eventType]?.map((event) => (
                                  <SelectItem key={event} value={event}>
                                    {event}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="branch"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Branch/Department</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your branch" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {branches.map((branch) => (
                                  <SelectItem key={branch} value={branch}>
                                    {branch}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800 mb-2">
                          <strong>Payment Information:</strong>
                        </p>
                        <p className="text-sm text-red-700 mb-2">
                          Please complete your payment using the official SBI
                          Collect Portal Here:
                        </p>
                        <a
                          href="https://www.onlinesbi.sbi/sbicollect/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                        >
                          Pay Registration Fee →
                        </a>
                      </div>
                      <FormField
                        control={form.control}
                        name="duNumber"
                        render={({ field }) => (
                          <FormItem className="relative">
                            <FormControl>
                              <Input
                                placeholder=""
                                {...field}
                                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-800 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:border-primary peer"
                              />
                            </FormControl>
                            <FormLabel className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/4 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-6 start-1">
                              DU Number (e.g., DUA1234567)
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmDuNumber"
                        render={({ field }) => (
                          <FormItem className="relative">
                            <FormControl>
                              <Input
                                placeholder=""
                                {...field}
                                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-800 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:border-primary peer"
                              />
                            </FormControl>
                            <FormLabel className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/4 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-6 start-1">
                              Confirm DU Number
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="participants"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>
                              Number of Additional Participants
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                value={field.value}
                                onChange={field.onChange}
                                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                              >
                                {projectTypeOptions[watchedEvent]?.map(
                                  (value) => (
                                    <RadioGroup.Option
                                      key={value}
                                      value={value}
                                      className={({ active, checked }) =>
                                        `${
                                          active
                                            ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
                                            : ""
                                        }
                                      ${
                                        checked
                                          ? "bg-primary bg-opacity-75 text-white"
                                          : "bg-white"
                                      }
                                      relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                                      }
                                    >
                                      {({ checked }) => (
                                        <div className="flex w-full items-center justify-between">
                                          <div className="flex items-center">
                                            <div className="text-sm">
                                              <RadioGroup.Label
                                                as="p"
                                                className={`font-medium ${
                                                  checked
                                                    ? "text-white"
                                                    : "text-gray-900"
                                                }`}
                                              >
                                                {value === "0"
                                                  ? "Only Me"
                                                  : `${value} additional participant${
                                                      value !== "1" ? "s" : ""
                                                    }`}
                                              </RadioGroup.Label>
                                            </div>
                                          </div>
                                          {checked && (
                                            <div className="shrink-0 text-white">
                                              <CheckIcon className="h-6 w-6" />
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </RadioGroup.Option>
                                  )
                                )}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {form.watch("participants") &&
                        form.watch("participants") !== "0" && (
                          <div className="mt-6 space-y-6">
                            {[...Array(Number(form.watch("participants")))].map(
                              (_, index) => (
                                <div
                                  key={index}
                                  className="bg-white p-4 rounded-lg border-2 border-primary/20"
                                >
                                  <h3 className="font-semibold mb-3 text-primary">
                                    Additional Participant {index + 1}
                                  </h3>
                                  <FormField
                                    control={form.control}
                                    name={`participantDetails.${index}.name`}
                                    render={({ field }) => (
                                      <FormItem className="relative">
                                        <FormControl>
                                          <Input
                                            placeholder=""
                                            {...field}
                                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-800 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:border-primary peer"
                                          />
                                        </FormControl>
                                        <FormLabel className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/4 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-6 start-1">
                                          Participant Name
                                        </FormLabel>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  )}
                  {step === 5 && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                          <h3 className="text-lg font-semibold text-blue-900 mb-4">
                            Review Your Registration
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div>
                                <strong>Name:</strong> {getFormData().name}
                              </div>
                              <div>
                                <strong>Phone:</strong> +91{" "}
                                {getFormData().phone}
                              </div>
                              <div>
                                <strong>Email:</strong> {getFormData().email}
                              </div>
                              <div>
                                <strong>College:</strong>{" "}
                                {getFormData().college}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <strong>Event Category:</strong>{" "}
                                {getFormData().eventType}
                              </div>
                              <div>
                                <strong>Event:</strong> {getFormData().event}
                              </div>
                              <div>
                                <strong>Branch:</strong> {getFormData().branch}
                              </div>
                              <div>
                                <strong>DU Number:</strong>{" "}
                                {getFormData().duNumber}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div>
                              <strong>Participants:</strong>{" "}
                              {getFormData().participants === "0"
                                ? "Solo participation"
                                : `Team of ${
                                    parseInt(getFormData().participants) + 1
                                  } members`}
                            </div>
                            {getFormData().participants !== "0" &&
                              getFormData().participantDetails?.length > 0 && (
                                <div className="mt-2">
                                  <strong>Team Members:</strong>
                                  <ul className="list-disc list-inside ml-4 mt-1">
                                    <li>{getFormData().name} (You)</li>
                                    {getFormData().participantDetails.map(
                                      (participant, index) => (
                                        <li key={index}>{participant.name}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                          </div>

                          <div className="mt-6 flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditStep(1)}
                              className="text-blue-600 border-blue-300 hover:bg-blue-50"
                            >
                              <Edit3 className="w-4 h-4 mr-1" />
                              Edit Personal Info
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditStep(2)}
                              className="text-blue-600 border-blue-300 hover:bg-blue-50"
                            >
                              <Edit3 className="w-4 h-4 mr-1" />
                              Edit Event Details
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditStep(4)}
                              className="text-blue-600 border-blue-300 hover:bg-blue-50"
                            >
                              <Edit3 className="w-4 h-4 mr-1" />
                              Edit Participants
                            </Button>
                          </div>
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="termsAccepted"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I confirm that all the information provided is
                                correct and true.
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>

            <CardFooter className="flex justify-between bg-gray-50 rounded-b-lg">
              {step > 1 && (
                <Button
                  type="button"
                  onClick={handlePrevious}
                  variant="outline"
                  disabled={mutation.isPending}
                >
                  Previous
                </Button>
              )}
              {step < 5 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="bg-primary text-white"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!isStepValid() || mutation.isPending}
                  className=" bg-green-500 disabled:bg-gray-500 text-white"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Confirm & Submit"
                  )}
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
      <ConfettiPopup
        isOpen={mutation.isSuccess || mutation.isError}
        onClose={() => mutation.reset()}
        isSuccess={mutation.isSuccess}
        title={
          mutation.isSuccess
            ? "Registration Successful!"
            : "Registration Failed!"
        }
        isLoading={mutation.isPending}
        description={
          mutation.isSuccess
            ? "You have successfully registered. You will redirect to home  by clicking button below"
            : "There was an error while registering. Please try again."
        }
      />
    </div>
  );
};

export default RegisterPage;
