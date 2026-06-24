import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  QrCode,
  Send,
  UserRound,
  Users,
} from "lucide-react";

import { branches } from "@/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const graduationDatesByBranch = {
  CSE: "05-07-2026",
  ECE: "05-07-2026",
  MECH: "05-07-2026",
  CIVIL: "05-07-2026",
  "CSE-IOT": "05-07-2026",
  "CSE-AIML": "05-07-2026",
  MBA: "05-07-2026",
  EEE: "05-07-2026",
  "CSE-AI": "05-07-2026",
  Others: "05-07-2026",
};

const guestOptions = ["0", "1", "2", "3", "4"];
const reportingTime = "08:30 AM";
const venue = "Auditorium";

const graduationFormSchema = z.object({
  studentName: z
    .string()
    .min(2, { message: "Student name must be at least 2 characters." }),
  hallTicketNumber: z
    .string()
    .min(6, { message: "Please enter a valid hall ticket number." }),
  branch: z.enum(branches, {
    errorMap: () => ({ message: "Please select your branch." }),
  }),
  mobileNumber: z
    .string()
    .regex(/^[0-9]{10}$/, { message: "Mobile number must be 10 digits." }),
  willAttend: z.enum(["Yes", "No"], {
    errorMap: () => ({ message: "Please select Yes or No." }),
  }),
  numberOfGuests: z.enum(guestOptions, {
    errorMap: () => ({ message: "Please select guests allowed." }),
  }),
  email: z.string().email({ message: "Please enter a valid email ID." }),
});

const getGraduationDate = (branch) =>
  graduationDatesByBranch[branch] || graduationDatesByBranch.Others;

const RegisterPage = () => {
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(graduationFormSchema),
    defaultValues: {
      studentName: "",
      hallTicketNumber: "",
      branch: "",
      mobileNumber: "",
      willAttend: "Yes",
      numberOfGuests: "0",
      email: "",
    },
    mode: "onChange",
  });

  const formValues = form.watch();
  const graduationDate = getGraduationDate(formValues.branch);
  const qrCodeValue = useMemo(() => {
    const hallTicket = formValues.hallTicketNumber || "XXXXXXXX";
    return `PBRVITS-GRAD-${hallTicket}`.toUpperCase();
  }, [formValues.hallTicketNumber]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      graduationDate: getGraduationDate(data.branch),
      reportingTime,
      venue,
      qrCode: `PBRVITS-GRAD-${data.hallTicketNumber}`.toUpperCase(),
      submittedAt: new Date().toISOString(),
    };

    const endpoint = import.meta.env.VITE_GRADUATION_FORM_ENDPOINT;

    if (!endpoint) {
      setSubmitStatus("success");
      setSubmitMessage(
        "Details are ready. Add VITE_GRADUATION_FORM_ENDPOINT to send these responses to your Google Sheet."
      );
      return;
    }

    try {
      setSubmitStatus("loading");
      setSubmitMessage("");
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      setSubmitStatus("success");
      setSubmitMessage(
        "Submitted successfully. Your graduation pass will be emailed after PDF generation."
      );
      form.reset();
    } catch {
      setSubmitStatus("error");
      setSubmitMessage("Submission failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 pt-24 px-4 pb-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="shadow-2xl">
          <CardHeader className="bg-primary text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <UserRound className="h-7 w-7" />
              Graduation Day Registration
            </CardTitle>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="grid gap-5 pt-6">
                <FormField
                  control={form.control}
                  name="studentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter student name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hallTicketNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hall Ticket Number</FormLabel>
                      <FormControl>
                        <Input placeholder="20A91A0401" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select branch" />
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

                  <FormItem>
                    <FormLabel>Graduation Day Date</FormLabel>
                    <div className="flex h-10 items-center rounded-md border border-input bg-gray-50 px-3 text-sm font-medium text-gray-700">
                      {graduationDate}
                    </div>
                  </FormItem>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input placeholder="10 digit mobile number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email ID</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="student@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="willAttend"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Will Attend?</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Yes or No" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numberOfGuests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Guests</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select guests" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {guestOptions.map((guestCount) => (
                              <SelectItem key={guestCount} value={guestCount}>
                                {guestCount}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {submitMessage && (
                  <div
                    className={`rounded-lg border p-3 text-sm ${
                      submitStatus === "error"
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-green-200 bg-green-50 text-green-700"
                    }`}
                  >
                    {submitMessage}
                  </div>
                )}
              </CardContent>

              <CardFooter className="justify-end bg-gray-50 rounded-b-lg">
                <Button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className="gap-2 bg-green-600 text-white hover:bg-green-700"
                >
                  {submitStatus === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Details
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card className="shadow-2xl">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              Graduation Pass Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 font-mono text-sm text-gray-900">
              <div className="border-y border-gray-400 py-3 text-center">
                <h2 className="text-lg font-bold tracking-wide">
                  PBR VITS GRADUATION DAY
                </h2>
              </div>

              <div className="mt-6 space-y-3">
                <PassRow
                  label="Student Name"
                  value={formValues.studentName || "Ravi Kumar"}
                />
                <PassRow
                  label="Hall Ticket"
                  value={formValues.hallTicketNumber || "20A91A0401"}
                />
                <PassRow label="Branch" value={formValues.branch || "ECE"} />
              </div>

              <div className="my-5 border-t border-gray-300" />

              <div className="space-y-3">
                <PassRow label="Graduation Date" value={graduationDate} />
                <PassRow label="Reporting Time" value={reportingTime} />
                <PassRow label="Venue" value={venue} />
                <PassRow
                  label="Guests Allowed"
                  value={formValues.numberOfGuests || "0"}
                />
              </div>

              <div className="my-5 border-t border-gray-300" />

              <div className="grid gap-4 sm:grid-cols-[96px_1fr] sm:items-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-md border border-gray-300 bg-gray-50">
                  <QrCode className="h-16 w-16 text-gray-800" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">QR Code</p>
                  <p className="break-all font-bold">{qrCodeValue}</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <div className="w-48 border-t border-gray-500 pt-2 text-center">
                  Principal Signature
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-gray-700">
              <InfoLine icon={CalendarDays} text={`Date: ${graduationDate}`} />
              <InfoLine icon={Clock} text={`Reporting Time: ${reportingTime}`} />
              <InfoLine icon={MapPin} text={`Venue: ${venue}`} />
              <InfoLine
                icon={Users}
                text={`Guests Allowed: ${formValues.numberOfGuests || "0"}`}
              />
              <InfoLine
                icon={Mail}
                text={`PDF will be emailed to: ${
                  formValues.email || "student@example.com"
                }`}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const PassRow = ({ label, value }) => (
  <div className="grid grid-cols-[140px_1fr] gap-3">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold">: {value}</span>
  </div>
);

const InfoLine = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3 rounded-md bg-gray-50 p-3">
    <Icon className="h-4 w-4 text-primary" />
    <span>{text}</span>
  </div>
);

export default RegisterPage;
