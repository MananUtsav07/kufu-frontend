import { Link } from "react-router-dom";

type NavbarLinksProps = {
  className?: string;
  buttonClassName: string;
  onNavigate: (id: string) => void;
};

const HOME_NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
] as const;

export function NavbarLinks({
  className,
  buttonClassName,
  onNavigate,
}: NavbarLinksProps) {
  return (
    <div className={className}>
      {HOME_NAV_LINKS.map((item) => (
        <button
          key={item.id}
          className={buttonClassName}
          type="button"
          onClick={() => onNavigate(item.id)}
        >
          {item.label}
        </button>
      ))}
      {/* Contact navigates to /contact page */}
      <Link to="/contact" className={buttonClassName}>
        Contact Us
      </Link>
    </div>
  );
}
