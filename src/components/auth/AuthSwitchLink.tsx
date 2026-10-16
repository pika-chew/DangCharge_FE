import { Link } from 'react-router'

type AuthSwitchLinkProps = {
  question: string
  linkLabel: string
  to: string
}

export function AuthSwitchLink({ question, linkLabel, to }: AuthSwitchLinkProps) {
  return (
    <p className="mt-7 text-center text-body-14 text-fg-secondary">
      {question}{' '}
      <Link className="font-bold text-brand no-underline" to={to}>{linkLabel}</Link>
    </p>
  )
}
