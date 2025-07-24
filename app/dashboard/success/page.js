import Link from "next/link";

export default async function SuccessPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-8">
      <h1 className="text-xl font-bold">Thank You For Your Purchase!</h1>
      <Link href="/dashboard" className="btn btn-primary">
        Dashboard
      </Link>
    </main>
  );
}
