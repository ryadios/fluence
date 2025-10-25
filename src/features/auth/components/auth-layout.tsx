import Image from "next/image";
import Link from "next/link";

export function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-muted min-h-svh flex flex-col justify-center items-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-lg flex-col gap-8">
                <Link
                    href="/"
                    className="flex items-center gap-4 self-center font-medium text-3xl"
                >
                    <Image
                        alt="fluence"
                        src="/logos/logo.svg"
                        width={150}
                        height={150}
                    />
                </Link>
                {children}
            </div>
        </div>
    );
}
