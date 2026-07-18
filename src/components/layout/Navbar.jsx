import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Logo from "@/components/ui/Logo";
import Avatar from "@/components/ui/Avatar";
import SearchField from "@/components/ui/SearchField";
import { mainNav } from "@/config/navigation";

export default function AppNavbar({
  links = mainNav,
  user,
  onSearch,
  onStartChat,
}) {
  return (
    <Navbar expand="lg" sticky="top" className="bg-white border-bottom py-3">
      <Container fluid className="px-4">
        <Navbar.Brand as={NavLink} to="/">
          <Logo />
        </Navbar.Brand>

        <div className="d-flex align-items-center gap-2 order-lg-last">
          {user && <Avatar name={user.name} className="d-flex d-lg-none" />}
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

          <div className="sb-nav-actions d-flex align-items-center gap-3 mt-3 mt-lg-0">
            <SearchField onChange={(e) => onSearch?.(e.target.value)} />

            <Button
              variant="primary"
              className="rounded-pill fw-semibold px-4 text-nowrap"
              onClick={onStartChat}
            >
              Start chatting
            </Button>

            {user && <Avatar name={user.name} className="d-none d-lg-flex" />}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
