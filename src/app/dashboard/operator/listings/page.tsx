import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function OperatorListingsIndexPage() {
  redirect("/dashboard/operator");
}
