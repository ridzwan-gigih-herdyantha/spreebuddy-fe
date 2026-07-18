import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Logo from "@/components/ui/Logo";
import { footerNav } from "@/config/navigation";

export default function AppFooter({ groups = footerNav }) {
  const year = new Date().getFullYear();

  return (
    <footer className="sb-footer sb-dark">
      <Container fluid className="px-4">
        <Row className="gy-5">
          <Col lg={4}>
            <Logo />
            <p className="sb-footer-tagline mt-3 mb-0">
              AI shopping assistant.
              <br />
              Find, compare, decide — through conversation.
            </p>
          </Col>

          <Col lg={{ span: 7, offset: 1 }}>
            <Row className="gy-4">
              {groups.map(({ title, links }) => (
                <Col xs={6} md={4} key={title}>
                  <h3 className="sb-footer-heading">{title}</h3>
                  <ul className="sb-footer-list">
                    {links.map(({ label, to }) => (
                      <li key={to}>
                        <NavLink to={to}>{label}</NavLink>
                      </li>
                    ))}
                  </ul>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        <hr className="sb-footer-rule" />

        <p className="sb-footer-legal mb-0">
          © {year} SpreeBuddy. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
