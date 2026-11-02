type Props = {
    children: string
    className?: string
    }

    export default function AuthDivider({ children, className = '' }: Props) {
    return (
        <div className={`auth-divider ${className}`.trim()}>
        <span>{children}</span>
        </div>
    )
}