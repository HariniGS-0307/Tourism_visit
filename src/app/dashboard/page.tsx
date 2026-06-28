import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardIndexPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  switch (session.user.role) {
    case "ADMIN":
      redirect("/dashboard/admin");
    case "OPERATOR":
      redirect("/dashboard/operator");
    default:
      redirect("/dashboard/user");
  }
}
