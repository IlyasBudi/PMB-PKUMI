"use client";
/* React/Nextjs/Modules */
import { useContext, useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";

/* Utils */
import { formLoginSchema } from "@/lib/forms/auth";
import { cn, schemaValidation } from "@/lib/utils";
import { loginSchema } from "@/validation/auth";
import httpCall from "@/lib/axios";
import * as constants from "@/lib/constants";
import { AppContext } from "@/context";

/* Components */
import Forms from "@/components/forms";
import ErrorMessage from "@/components/forms/ErrorMessage";
import { Button } from "@/components/ui/Button";
import Label from "@/components/forms/Label";

export default function FormLogin() {
  const router = useRouter();
  const { handleToast } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { username: "", password: "", is_remember: false },
    validate: (values) => {
      const validate = schemaValidation(loginSchema, values);
      return validate.error || {};
    },
    onSubmit: (values) => {
      setLoading(true);
      httpCall("POST", constants.API_PATH.AUTH_LOGIN, values)
        .then(() => {
          handleToast(
            "success",
            "Login Berhasil",
            "Anda akan diarahkan ke halaman utama",
            3000
          );
          router.push("/"); // 🔹 pindah ke route /
          router.refresh(); // 🔹 refresh agar state global & server component ikut update
        })
        .catch((error) => {
          handleToast("warn", "Login Gagal", error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-y-4">
      {Object.keys(formik.initialValues).map((key, index) => (
        <div
          key={index}
          className={cn(
            "flex gap-2",
            key === "is_remember"
              ? "flex-row-reverse items-center justify-end"
              : "flex-col"
          )}
        >
          <Label
            htmlFor={key}
            className={key === "is_remember" ? "font-normal" : ""}
          >
            {formLoginSchema[key].label}
          </Label>
          <Forms
            formtype={formLoginSchema[key].type}
            id={key}
            name={key}
            placeholder={formLoginSchema[key].placeholder}
            value={formik.values[key]}
            checked={formik.values[key]}
            onChange={formik.handleChange}
            disabled={loading}
            className={
              formik.touched[key] && formik.errors[key]
                ? "border border-red-400"
                : ""
            }
          />
          <ErrorMessage
            formtype={formLoginSchema[key].type}
            isError={formik.touched[key] && formik.errors[key]}
            error={formik.errors[key]}
          />
        </div>
      ))}
      <Button loading={loading} label="Login" type="submit" />
    </form>
  );
}
