import type { ReactNode } from 'react'

function Svg({ children }: { children: ReactNode }) {
    return (
        <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        >
        {children}
        </svg>
    )
    }

    export function MailIcon() {
    return (
        <Svg>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
        </Svg>
    )
    }

    export function LockIcon() {
    return (
        <Svg>
        <rect x="5" y="10.5" width="14" height="10" rx="2" fill="currentColor" />
        <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
        </Svg>
    )
}

export function GoogleLogo() {
    return (
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
    )
}

export function UserIcon() {
    return (
        <Svg>
        <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" />
        <circle cx="12" cy="10" r="3.2" fill="#fff" stroke="none" />
        <path d="M6.2 18.2a6.5 6.5 0 0 1 11.6 0A9.9 9.9 0 0 1 12 22a9.9 9.9 0 0 1-5.8-3.8Z" fill="#fff" stroke="none" />
        </Svg>
    )
}

export function CalendarIcon() {
    return (
        <Svg>
        <rect x="3.5" y="5" width="17" height="15" rx="2" />
        <path d="M3.5 10h17M8 3v4M16 3v4" />
        </Svg>
    )
}