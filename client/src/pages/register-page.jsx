import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CheckCircle2,
  Download,
  Loader2,
  RotateCcw,
  Send,
  UserRound,
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
  CSE: "04-07-2026",
  "CSE-IOT": "04-07-2026",
  MBA: "04-07-2026",
  ECE: "05-07-2026",
  CIVIL: "05-07-2026",
  "CSE-AIML": "05-07-2026",
  "CSE-AI": "05-07-2026",
  AIML: "05-07-2026",
  IoT: "04-07-2026",
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
    errorMap: () => ({ message: "Please select number of guests." }),
  }),
  email: z.string().email({ message: "Please enter a valid email ID." }),
});

const getGraduationDate = (branch) =>
  graduationDatesByBranch[branch] || graduationDatesByBranch.Others;

const RegisterPage = () => {
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submittedPass, setSubmittedPass] = useState(null);

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

  const selectedBranch = form.watch("branch");
  const graduationDate = getGraduationDate(selectedBranch);

  const onSubmit = async (data) => {
    const passData = {
      ...data,
      graduationDate: getGraduationDate(data.branch),
      reportingTime,
      venue,
      submittedAt: new Date().toISOString(),
    };

    const endpoint = import.meta.env.VITE_GRADUATION_FORM_ENDPOINT;

    try {
      setSubmitStatus("loading");
      setSubmitMessage("");

      if (endpoint) {
        await fetch(endpoint, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(passData),
        });
      }

      setSubmittedPass(passData);
      setSubmitStatus("success");
      setSubmitMessage(
        endpoint
          ? "Submitted successfully. Your pass is ready below."
          : "Pass preview is ready. Add VITE_GRADUATION_FORM_ENDPOINT to also send responses to Google Sheets."
      );
    } catch {
      setSubmitStatus("error");
      setSubmitMessage("Submission failed. Please try again.");
    }
  };

  const handleNewRegistration = () => {
    form.reset();
    setSubmitStatus("idle");
    setSubmitMessage("");
    setSubmittedPass(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 px-4 pb-10 pt-24">
      <div className="mx-auto flex w-full max-w-3xl justify-center">
        {!submittedPass ? (
          <Card className="w-full overflow-hidden shadow-2xl">
            <CardHeader className="bg-primary text-white">
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
                            <Input
                              placeholder="10 digit mobile number"
                              {...field}
                            />
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
                    <StatusMessage
                      status={submitStatus}
                      message={submitMessage}
                    />
                  )}
                </CardContent>

                <CardFooter className="justify-end bg-gray-50">
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
        ) : (
          <Card className="w-full overflow-hidden shadow-2xl">
            <CardHeader className="bg-white border-b">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
                Graduation Pass Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {submitMessage && (
                <StatusMessage status={submitStatus} message={submitMessage} />
              )}
              <div className="mt-4">
                <PassPreview pass={submittedPass} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 bg-gray-50 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleNewRegistration}
                className="w-full gap-2 sm:w-auto"
              >
                <RotateCcw className="h-4 w-4" />
                New Registration
              </Button>
              <Button
                type="button"
                onClick={() => downloadPassAsPdf(submittedPass)}
                className="w-full gap-2 bg-green-600 text-white hover:bg-green-700 sm:w-auto"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

const StatusMessage = ({ status, message }) => (
  <div
    className={`rounded-lg border p-3 text-sm ${
      status === "error"
        ? "border-red-200 bg-red-50 text-red-700"
        : "border-green-200 bg-green-50 text-green-700"
    }`}
  >
    {message}
  </div>
);

const PassPreview = ({ pass }) => (
  <div
    id="graduation-pass"
    className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 font-mono text-sm text-gray-900"
  >
    <div className="border-y border-gray-400 py-3 text-center">
      <h2 className="text-lg font-bold tracking-wide">
        PBR VITS GRADUATION DAY
      </h2>
    </div>

    <div className="mt-6 space-y-3">
      <PassRow label="Student Name" value={pass.studentName} />
      <PassRow label="Hall Ticket" value={pass.hallTicketNumber} />
      <PassRow label="Branch" value={pass.branch} />
    </div>

    <div className="my-5 border-t border-gray-300" />

    <div className="space-y-3">
      <PassRow label="Graduation Date" value={pass.graduationDate} />
      <PassRow label="Reporting Time" value={pass.reportingTime} />
      <PassRow label="Venue" value={pass.venue} />
      <PassRow label="Guests Allowed" value={pass.numberOfGuests} />
    </div>

    <div className="mt-10 flex justify-end">
      <div className="w-48 border-t border-gray-500 pt-2 text-center">
        Principal Signature
      </div>
    </div>
  </div>
);

const PassRow = ({ label, value }) => (
  <div className="grid grid-cols-[140px_1fr] gap-3">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold">: {value}</span>
  </div>
);

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const downloadPassAsPdf = (pass) => {
  const html = `
    <!doctype html>
    <html>
      <head>
        <title>Graduation Pass - ${escapeHtml(pass.hallTicketNumber)}</title>
        <style>
          @page { size: A4; margin: 24mm; }
          body { font-family: "Courier New", monospace; color: #111827; }
          .pass { border: 2px dashed #d1d5db; padding: 28px; max-width: 680px; margin: 0 auto; }
          .title { border-top: 1px solid #6b7280; border-bottom: 1px solid #6b7280; padding: 16px; text-align: center; font-weight: 700; font-size: 20px; letter-spacing: 1px; }
          .section { margin-top: 28px; }
          .row { display: grid; grid-template-columns: 180px 1fr; gap: 16px; margin: 14px 0; font-size: 15px; }
          .label { color: #4b5563; }
          .value { font-weight: 700; }
          .line { border-top: 1px solid #d1d5db; margin: 28px 0; }
          .signature { width: 220px; border-top: 1px solid #4b5563; margin: 56px 0 0 auto; padding-top: 10px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="pass">
          <div class="title">PBR VITS GRADUATION DAY</div>
          <div class="section">
            <div class="row"><span class="label">Student Name</span><span class="value">: ${escapeHtml(pass.studentName)}</span></div>
            <div class="row"><span class="label">Hall Ticket</span><span class="value">: ${escapeHtml(pass.hallTicketNumber)}</span></div>
            <div class="row"><span class="label">Branch</span><span class="value">: ${escapeHtml(pass.branch)}</span></div>
          </div>
          <div class="line"></div>
          <div class="section">
            <div class="row"><span class="label">Graduation Date</span><span class="value">: ${escapeHtml(pass.graduationDate)}</span></div>
            <div class="row"><span class="label">Reporting Time</span><span class="value">: ${escapeHtml(pass.reportingTime)}</span></div>
            <div class="row"><span class="label">Venue</span><span class="value">: ${escapeHtml(pass.venue)}</span></div>
            <div class="row"><span class="label">Guests Allowed</span><span class="value">: ${escapeHtml(pass.numberOfGuests)}</span></div>
          </div>
          <div class="signature">Principal Signature</div>
        </div>
        <script>
          window.addEventListener("load", () => {
            window.print();
          });
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};

export default RegisterPage;
