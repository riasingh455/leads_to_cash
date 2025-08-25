"use client";

import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "@/lib/authConfig";
import { Button } from "@/components/ui/button";
import { Building, LogIn } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const handleLogin = () => {
        instance.loginRedirect(loginRequest).catch(e => {
            console.error(e);
        });
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-md p-8 space-y-8 bg-card text-card-foreground rounded-lg shadow-lg">
                <div className="text-center">
                    <div className="flex justify-center items-center mb-4">
                        <Building className="size-12 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold font-headline">Leads to Cash</h1>
                    <p className="text-muted-foreground mt-2">Sign in to access your dashboard</p>
                </div>
                <Button onClick={handleLogin} className="w-full" size="lg">
                    <LogIn className="mr-2"/>
                    Sign in with Microsoft
                </Button>
                 <div className="text-center text-xs text-muted-foreground">
                    <p>
                        Please make sure to configure your Client ID and Tenant ID in `src/lib/authConfig.ts`.
                    </p>
                </div>
            </div>
        </div>
    );
}
