'use client'
import { ContextAppProvider } from "@/Context"

export const Providers = ({ children }) => {
    return <ContextAppProvider>
        {children}
    </ContextAppProvider>
}