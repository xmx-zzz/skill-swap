import { GoogleLogo } from './AuthIcons'

type Props = {
    children: string
    onClick: () => void
    disabled?: boolean
}

export default function GoogleButton({ children, onClick, disabled }: Props) {
    return (
        <button className="auth-button auth-button--google" type="button" onClick={onClick} disabled={disabled}>
        <GoogleLogo />
        {children}
        </button>
    )
}