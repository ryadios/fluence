import { SignupForm } from "@/features/auth/components/signup-form";
import { requireUnAuth } from "@/lib/auth-utils";

export default async function LoginPage() {
    await requireUnAuth();

    return (
        <div>
            <SignupForm />
        </div>
    );
}
