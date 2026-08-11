import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import Logo from "@/components/ui/Logo";
import Avatar from "@/components/ui/Avatar";
import SearchField from "@/components/ui/SearchField";
import { mainNav } from "@/config/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

function CartLink({ count }) {
  return (
    <Link
      to="/cart"
      className="sb-nav-icon"
      aria-label={`Cart, ${count} items`}
    >
      <i className="bi bi-cart2" />
      {count > 0 && <span className="sb-nav-badge">{count}</span>}
    </Link>
  );
}

export default function AppNavbar({ links = mainNav, onSearch, onStartChat }) {
  const { user } = useAuth();
  const { count } = useCart();

  const avatar = user ? (
    <Avatar name={user.name} src={user.avatarUrl} title={user.name} />
  ) : (
    <Link to="/login" className="sb-pill sb-pill-outline text-nowrap">
      Sign in
    </Link>
  );

  return (
    <Navbar expand="lg" sticky="top" className="bg-white border-bottom">
      <Container fluid className="px-4">
        <Navbar.Brand as={NavLink} to="/">
          <Logo />
        </Navbar.Brand>

        <div className="d-flex align-items-center gap-2 order-lg-last">
          <span className="d-flex d-lg-none">
            <CartLink count={count} />
          </span>
          <Navbar.Toggle aria-controls="sb-nav" />
        </div>

        <Navbar.Collapse id="sb-nav">
          <Nav className="me-auto">
            {links.map(({ label, to, end }) => (
              <Nav.Link key={to} as={NavLink} to={to} end={end}>
                {label}
              </Nav.Link>
            ))}
          </Nav>

          <div className="sb-nav-actions d-flex align-items-center gap-lg-4 gap-3 mt-3 mt-lg-0">
            <SearchField onChange={(e) => onSearch?.(e.target.value)} />

            <span className="d-none d-lg-flex">
              <CartLink count={count} />
            </span>

            <Button
              variant="primary"
              className="rounded-pill fw-semibold px-4 text-nowrap"
              onClick={onStartChat}
            >
              Start chatting
            </Button>

            {avatar}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
