type NavbarLinksProps = {
  className?: string
  buttonClassName: string
  onNavigate: (id: string) => void
  onCaseStudiesNavigate: () => void
}

const HOME_NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
  { id: 'case-studies', label: 'Case Studies' },
] as const

export function NavbarLinks({
  className,
  buttonClassName,
  onNavigate,
  onCaseStudiesNavigate,
}: NavbarLinksProps) {
  return (
    <div className={className}>
      {HOME_NAV_LINKS.map((item) => (
        <button
          key={item.id}
          className={buttonClassName}
          type="button"
          onClick={() =>
            item.id === 'case-studies' ? onCaseStudiesNavigate() : onNavigate(item.id)
          }
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
