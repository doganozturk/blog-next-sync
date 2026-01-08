import { redirect } from "next/navigation";

export default function RootPage() {
  // Using type assertion for dynamic [lang] route
  redirect("/en/" as "/[lang]");
}
