import { Form } from "react-router";
import type { Route } from "./+types";

// Remeber: All this runs on the server
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const subject = String(formData.get("subject") ?? "");
  const message = String(formData.get("message") ?? "");

  // Validate form input
  const errors: Record<string, string> = {};

  if (!name.trim()) {
    errors.name = "Name is required.";
  }

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
  }

  if (!subject.trim()) {
    errors.subject = "Subject is required.";
  }

  if (!message.trim()) {
    errors.message = "Message is required.";
  }

  // If we have any errors return them along with the submitted values to re-populate the form
  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values: { name, email, subject, message },
    };
  }

  const data = {
    name,
    email,
    subject,
    message,
  };

  // This runs on the server, so we could directly access our database here

  return {
    message: "Form data received",
    data,
    values: { name: "", email: "", subject: "", message: "" },
  };
}

const ContactPage = ({ actionData }: Route.ComponentProps) => {
  return (
    <div className="max-w-3xl mx-auto mt-12 px-6 py-8 bg-gray-900">
      <h2 className="text-3xl font-bold text-gray-400 mb-8 text-center">
        ✉ Contact Us
      </h2>

      {actionData?.message ? (
        <p className="mb-6 p-4  bg-green-700 text-green-200 text-center rounded-lg border border-green-500 shadow-md">
          {actionData.message}
        </p>
      ) : null}

      <Form method="post" className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={actionData?.values?.name ?? ""}
            className={`mt-1 block w-full px-3 py-2 bg-gray-800 border rounded-md text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              actionData?.errors?.name ? "border-red-500" : "border-gray-500"
            }`}
          />
          {actionData?.errors?.name ? (
            <p className="mt-1 text-sm text-red-400">
              {actionData.errors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            defaultValue={actionData?.values?.email ?? ""}
            className={`mt-1 block w-full px-3 py-2 bg-gray-800 border rounded-md text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              actionData?.errors?.email ? "border-red-500" : "border-gray-500"
            }`}
          />
          {actionData?.errors?.email ? (
            <p className="mt-1 text-sm text-red-400">
              {actionData.errors.email}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-300"
          >
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            defaultValue={actionData?.values?.subject ?? ""}
            className={`mt-1 block w-full px-3 py-2 bg-gray-800 border rounded-md text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              actionData?.errors?.subject ? "border-red-500" : "border-gray-500"
            }`}
          />
          {actionData?.errors?.subject ? (
            <p className="mt-1 text-sm text-red-400">
              {actionData.errors.subject}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-300"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            defaultValue={actionData?.values?.message ?? ""}
            className={`mt-1 block w-full px-3 py-2 bg-gray-800 border rounded-md text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              actionData?.errors?.message ? "border-red-500" : "border-gray-500"
            }`}
          ></textarea>
          {actionData?.errors?.message ? (
            <p className="mt-1 text-sm text-red-400">
              {actionData.errors.message}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md cursor-pointer"
        >
          Send Message
        </button>
      </Form>
    </div>
  );
};

export default ContactPage;
