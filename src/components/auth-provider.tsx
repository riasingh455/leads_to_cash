"use client";

import React from "react";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/lib/authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <MsalProvider instance={msalInstance}>
            {children}
        </MsalProvider>
    );
};
