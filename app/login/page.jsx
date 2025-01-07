import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import SignInPage from '@/component/SignInPage'

export default async function Page() {
  // 1. Check if user is already authenticated on the server.
  const session = await getServerSession(authOptions)

  // 2. If user is logged in, redirect immediately—no need to show the sign-in form.
  if (session) {
    redirect('/home')
  }

  // 3. Otherwise, render the client-side sign in page.
  return <SignInPage />
}
