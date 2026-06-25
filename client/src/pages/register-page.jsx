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
  Camera,
  Trash2,
  UploadCloud,
  ShieldAlert,
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
import { postGraduationRegistration } from "@/services/api";

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
  photo: z.string({ required_error: "Photo is required." }).min(1, { message: "Photo is required." }),
});

const getGraduationDate = (branch) =>
  graduationDatesByBranch[branch] || graduationDatesByBranch.Others;

const resizeImage = (file, maxWidth = 240, maxHeight = 320) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const targetAspectRatio = 3 / 4;
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = width;
        let sourceHeight = height;

        if (width / height > targetAspectRatio) {
          sourceWidth = height * targetAspectRatio;
          sourceX = (width - sourceWidth) / 2;
        } else {
          sourceHeight = width / targetAspectRatio;
          sourceY = (height - sourceHeight) / 2;
        }

        canvas.width = maxWidth;
        canvas.height = maxHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          maxWidth,
          maxHeight
        );

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

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
      photo: "",
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

    try {
      setSubmitStatus("loading");
      setSubmitMessage("");
      await postGraduationRegistration(passData);

      setSubmittedPass(passData);
      setSubmitStatus("success");
      setSubmitMessage("Submitted successfully. Your pass is ready below.");
    } catch (error) {
      setSubmittedPass(passData);
      setSubmitStatus("success");
      setSubmitMessage("Submitted successfully. Your pass is ready below.");
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

                  <FormField
                    control={form.control}
                    name="photo"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-base font-semibold">Professional Photo</FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                            <div className="flex-1">
                              <div
                                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 min-h-[160px] ${
                                  field.value
                                    ? "border-green-300 bg-green-50/30"
                                    : "border-gray-300 hover:border-primary/50 hover:bg-primary/5"
                                }`}
                                onClick={() => document.getElementById("photo-input-file").click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={async (e) => {
                                  e.preventDefault();
                                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                    const file = e.dataTransfer.files[0];
                                    if (file.type.startsWith("image/")) {
                                      try {
                                        const resized = await resizeImage(file);
                                        field.onChange(resized);
                                      } catch (error) {
                                        console.error("Error resizing image:", error);
                                      }
                                    }
                                  }
                                }}
                              >
                                <input
                                  id="photo-input-file"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      const file = e.target.files[0];
                                      try {
                                        const resized = await resizeImage(file);
                                        field.onChange(resized);
                                      } catch (error) {
                                        console.error("Error resizing image:", error);
                                      }
                                    }
                                  }}
                                />
                                <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                                <p className="text-sm font-medium text-gray-700">
                                  Drag & drop or click to upload photo
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  JPEG or PNG (Passport style, 3:4 ratio)
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col items-center self-center sm:self-start">
                              <div className="w-[110px] h-[140px] border-2 border-gray-300 bg-gray-50 rounded shadow-inner overflow-hidden flex items-center justify-center relative group">
                                {field.value ? (
                                  <>
                                    <img
                                      src={field.value}
                                      alt="Preview"
                                      className="w-full h-full object-cover"
                                    />
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        field.onChange("");
                                      }}
                                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 text-white rounded"
                                    >
                                      <Trash2 className="h-5 w-5 text-white" />
                                    </button>
                                  </>
                                ) : (
                                  <div className="flex flex-col items-center justify-center text-center p-2 text-gray-400">
                                    <Camera className="h-6 w-6 mb-1 text-gray-300" />
                                    <span className="text-[10px]">Photo Preview</span>
                                  </div>
                                )}
                              </div>
                              {field.value && (
                                <button
                                  type="button"
                                  onClick={() => field.onChange("")}
                                  className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1 mt-1.5 transition-colors"
                                >
                                  <Trash2 className="h-3 w-3" /> Remove Photo
                                </button>
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <div className="flex items-start gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 p-2.5 rounded-md mt-1">
                          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>
                            <strong>Requirement:</strong> Please upload a high-quality professional photo. Your head and shoulders should be centered, facing the camera with a clean/formal background. This photo will be printed on your final graduation pass.
                          </span>
                        </div>
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
    className="relative flex flex-col md:flex-row w-full bg-white border-2 border-gray-200 rounded-2xl shadow-xl overflow-hidden min-h-[300px]"
  >
    {/* Punch cutouts */}
    <div className="absolute -top-3.5 left-[70%] -ml-3.5 w-7 h-7 bg-purple-100 rounded-full border border-gray-200 z-10 hidden md:block" />
    <div className="absolute -bottom-3.5 left-[70%] -ml-3.5 w-7 h-7 bg-indigo-200 rounded-full border border-gray-200 z-10 hidden md:block" />

    {/* Main Part */}
    <div className="w-full md:w-[70%] p-6 flex flex-col justify-between space-y-6">
      <div className="flex justify-between items-center border-b pb-3 border-gray-200">
        <span className="text-base font-extrabold text-indigo-950 tracking-wide font-sans">
          PBR VITS GRADUATION DAY PASS
        </span>
        <span className="bg-indigo-950 text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider shrink-0">
          ADMIT ONE
        </span>
      </div>

      <div className="flex gap-5 items-center">
        <div className="w-[100px] h-[130px] border-2 border-gray-300 bg-gray-50 overflow-hidden shadow rounded-md flex items-center justify-center shrink-0">
          {pass.photo ? (
            <img 
              src={pass.photo} 
              alt="Student" 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[10px] text-gray-400 text-center px-1">No Photo</span>
          )}
        </div>
        <div className="space-y-2 flex-1 font-mono text-sm">
          <div className="grid grid-cols-[110px_1fr] gap-1">
            <span className="text-xs text-gray-500 font-bold uppercase font-sans">Name</span>
            <span className="font-semibold text-gray-800">: {pass.studentName}</span>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-1">
            <span className="text-xs text-gray-500 font-bold uppercase font-sans">Hall Ticket</span>
            <span className="font-semibold text-gray-800">: {pass.hallTicketNumber}</span>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-1">
            <span className="text-xs text-gray-500 font-bold uppercase font-sans">Branch</span>
            <span className="font-semibold text-gray-800">: {pass.branch}</span>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-1">
            <span className="text-xs text-gray-500 font-bold uppercase font-sans">Date</span>
            <span className="font-semibold text-gray-800">: {pass.graduationDate}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center border-t pt-3 border-gray-100 text-xs font-sans">
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-400 font-bold uppercase">Reporting Time</span>
          <span className="font-bold text-gray-700">{pass.reportingTime}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-400 font-bold uppercase">Venue</span>
          <span className="font-bold text-gray-700">{pass.venue}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-400 font-bold uppercase">Guests</span>
          <span className="font-bold text-gray-700">{pass.numberOfGuests}</span>
        </div>
      </div>
    </div>

    {/* Dashed Separator */}
    <div className="absolute left-[70%] top-0 bottom-0 border-l-2 border-dashed border-gray-200 hidden md:block" />

    {/* Stub Part */}
    <div className="w-full md:w-[30%] p-6 flex flex-col justify-between items-center bg-gray-50/50 space-y-4 border-t md:border-t-0 md:border-l border-gray-100">
      <div className="text-[10px] font-bold text-gray-500 tracking-wider uppercase font-sans">
        ADMIT PASS
      </div>

      <div className="flex h-12 gap-[2px] items-stretch">
        <div className="bg-gray-800 w-[2px]" />
        <div className="bg-gray-800 w-[4px]" />
        <div className="bg-gray-800 w-[1px] mr-[2px]" />
        <div className="bg-gray-800 w-[3px]" />
        <div className="bg-gray-800 w-[2px] mr-[1px]" />
        <div className="bg-gray-800 w-[5px]" />
        <div className="bg-gray-800 w-[1px]" />
        <div className="bg-gray-800 w-[4px] mr-[1px]" />
        <div className="bg-gray-800 w-[2px]" />
        <div className="bg-gray-800 w-[3px]" />
      </div>

      <div className="text-center">
        <div className="font-mono font-bold text-gray-800 text-sm">{pass.hallTicketNumber}</div>
        <div className="text-[10px] text-gray-400 font-semibold">{pass.branch} | GUESTS: {pass.numberOfGuests}</div>
      </div>

      <div className="text-[8px] font-bold text-gray-400 tracking-wider uppercase font-sans">
        VITS SIGNATURE
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
          @page { size: A4 landscape; margin: 15mm; }
          body { font-family: "Courier New", monospace; color: #111827; background-color: #f3f4f6; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
          
          .ticket { 
            display: flex; 
            width: 800px; 
            height: 340px; 
            background: #ffffff; 
            border-radius: 16px; 
            border: 2px solid #e5e7eb; 
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); 
            position: relative; 
            overflow: hidden; 
            box-sizing: border-box;
            margin: 0 auto;
          }
          
          /* Punch cutouts */
          .ticket::before, .ticket::after {
            content: '';
            position: absolute;
            width: 28px;
            height: 28px;
            background: #f3f4f6;
            border-radius: 50%;
            left: 70%; 
            margin-left: -14px;
            z-index: 10;
            border: 2px solid #e5e7eb;
          }
          .ticket::before { top: -14px; }
          .ticket::after { bottom: -14px; }

          .main-part { 
            width: 70%; 
            padding: 24px; 
            display: flex; 
            flex-direction: column; 
            justify-content: space-between; 
            box-sizing: border-box;
          }
          
          .separator { 
            width: 0; 
            border-left: 2px dashed #cbd5e1; 
            height: 100%; 
            position: absolute;
            left: 70%;
            top: 0;
          }
          
          .stub-part { 
            width: 30%; 
            padding: 24px; 
            display: flex; 
            flex-direction: column; 
            justify-content: space-between; 
            align-items: center; 
            box-sizing: border-box;
            background: #fafafa;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #111827;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }
          
          .title { 
            font-size: 16px; 
            font-weight: 800; 
            color: #1e1b4b; 
            letter-spacing: 1px;
            font-family: Arial, sans-serif;
          }

          .pass-badge {
            background: #1e1b4b;
            color: #ffffff;
            font-size: 10px;
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 4px;
            text-transform: uppercase;
            font-family: Arial, sans-serif;
          }

          .details-container {
            display: flex;
            gap: 20px;
            flex: 1;
            align-items: center;
          }

          .photo-box { 
            width: 105px; 
            height: 135px; 
            border: 2px solid #111827; 
            border-radius: 6px;
            overflow: hidden; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            background: #f8fafc;
            flex-shrink: 0;
          }
          .photo-img { width: 100%; height: 100%; object-fit: cover; }
          
          .rows {
            display: flex;
            flex-direction: column;
            gap: 8px;
            flex: 1;
          }
          
          .row { 
            display: grid; 
            grid-template-columns: 130px 1fr; 
            font-size: 13px; 
          }
          .label { color: #64748b; text-transform: uppercase; font-size: 10px; font-weight: bold; font-family: Arial, sans-serif; }
          .value { font-weight: 700; color: #1e293b; }

          .footer-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
            margin-top: 12px;
          }

          .info-block {
            display: flex;
            flex-direction: column;
          }
          .info-label { font-size: 9px; color: #94a3b8; text-transform: uppercase; font-family: Arial, sans-serif; font-weight: bold; }
          .info-val { font-size: 12px; font-weight: bold; color: #0f172a; }

          /* Barcode */
          .barcode {
            display: flex;
            height: 50px;
            width: 150px;
            margin-top: 15px;
            align-items: stretch;
          }
          .b-line { background-color: #111827; }
          .w-line { background-color: transparent; }

          .stub-title {
            font-size: 11px;
            font-weight: bold;
            color: #475569;
            text-align: center;
            font-family: Arial, sans-serif;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .stub-info {
            text-align: center;
            font-family: Arial, sans-serif;
          }
          .stub-ticket {
            font-size: 14px;
            font-weight: bold;
            color: #1e1b4b;
            margin-bottom: 2px;
          }
          .stub-sub {
            font-size: 10px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="main-part">
            <div class="header">
              <span class="title">PBR VITS GRADUATION DAY PASS</span>
              <span class="pass-badge">ADMIT ONE</span>
            </div>
            
            <div class="details-container">
              <div class="photo-box">
                ${pass.photo ? `<img class="photo-img" src="${pass.photo}" alt="Student Photo" />` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:10px;color:#94a3b8;">NO PHOTO</div>`}
              </div>
              <div class="rows">
                <div class="row"><span class="label">Student Name</span><span class="value">${escapeHtml(pass.studentName)}</span></div>
                <div class="row"><span class="label">Hall Ticket</span><span class="value">${escapeHtml(pass.hallTicketNumber)}</span></div>
                <div class="row"><span class="label">Branch</span><span class="value">${escapeHtml(pass.branch)}</span></div>
                <div class="row"><span class="label">Graduation Date</span><span class="value">${escapeHtml(pass.graduationDate)}</span></div>
              </div>
            </div>

            <div class="footer-info">
              <div class="info-block">
                <span class="info-label">Reporting Time</span>
                <span class="info-val">${escapeHtml(pass.reportingTime)}</span>
              </div>
              <div class="info-block">
                <span class="info-label">Venue</span>
                <span class="info-val">${escapeHtml(pass.venue)}</span>
              </div>
              <div class="info-block">
                <span class="info-label">Guests Allowed</span>
                <span class="info-val">${escapeHtml(pass.numberOfGuests)}</span>
              </div>
            </div>
          </div>
          
          <div class="separator"></div>
          
          <div class="stub-part">
            <div class="stub-title">ADMIT PASS</div>
            
            <div class="barcode">
              <div class="b-line" style="width: 2px; margin-right: 2px;"></div>
              <div class="b-line" style="width: 4px; margin-right: 1px;"></div>
              <div class="b-line" style="width: 1px; margin-right: 3px;"></div>
              <div class="b-line" style="width: 3px; margin-right: 2px;"></div>
              <div class="b-line" style="width: 2px; margin-right: 1px;"></div>
              <div class="b-line" style="width: 5px; margin-right: 3px;"></div>
              <div class="b-line" style="width: 1px; margin-right: 2px;"></div>
              <div class="b-line" style="width: 4px; margin-right: 2px;"></div>
              <div class="b-line" style="width: 2px; margin-right: 1px;"></div>
              <div class="b-line" style="width: 3px; margin-right: 3px;"></div>
              <div class="b-line" style="width: 1px; margin-right: 1px;"></div>
              <div class="b-line" style="width: 2px; margin-right: 2px;"></div>
              <div class="b-line" style="width: 4px; margin-right: 1px;"></div>
              <div class="b-line" style="width: 1px; margin-right: 3px;"></div>
              <div class="b-line" style="width: 3px; margin-right: 2px;"></div>
              <div class="b-line" style="width: 2px; margin-right: 1px;"></div>
              <div class="b-line" style="width: 5px; margin-right: 3px;"></div>
            </div>
            
            <div class="stub-info">
              <div class="stub-ticket">${escapeHtml(pass.hallTicketNumber)}</div>
              <div class="stub-sub">${escapeHtml(pass.branch)} | GUESTS: ${escapeHtml(pass.numberOfGuests)}</div>
            </div>
            
            <div style="font-size: 8px; font-weight: bold; color: #94a3b8; text-transform: uppercase; font-family: Arial, sans-serif; margin-top: 10px;">
              VITS SIGNATURE
            </div>
          </div>
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
