import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          FreshTrack
        </span>
        <h1 className="mt-4 text-2xl font-bold text-foreground text-balance">
          Something Went Wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {params?.error
            ? `Error: ${params.error}`
            : 'An unspecified error occurred.'}
        </p>
        <Button asChild className="mt-6 w-full">
          <Link href="/auth/login">Back to Sign In</Link>
        </Button>
      </div>
    </div>
  )
}
