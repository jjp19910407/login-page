import { getSession } from "@/lib/auth"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NavbarUserClient } from "./NavbarUserClient"

export async function NavbarUserArea() {
  const session = await getSession()
  if (!session.userId) return <NavbarUserClient user={null} />

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1)
    .then((r) => r[0] || null)

  return (
    <NavbarUserClient
      user={user ? { ...user, role: user.role ?? "user" } : null}
    />
  )
}
