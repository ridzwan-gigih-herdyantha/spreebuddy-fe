import { Row, Col, Button } from "react-bootstrap";
import SpecSection from "@/components/styleguide/SpecSection";
import TokenSwatch from "@/components/styleguide/TokenSwatch";
import SpecimenRow from "@/components/styleguide/SpecimenRow";
import Logo from "@/components/ui/Logo";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import GradientBadge from "@/components/ui/GradientBadge";
import Chip from "@/components/ui/Chip";
import Card from "@/components/ui/Card";
import IconButton from "@/components/ui/IconButton";
import SearchField from "@/components/ui/SearchField";
import PromptInput from "@/components/ui/PromptInput";
import ProductCard from "@/components/ui/ProductCard";
import ChatPreview from "@/components/ui/ChatPreview";
import CtaBanner from "@/components/ui/CtaBanner";
import {
  foundationsMeta,
  sections,
  colorGroups,
  typeScale,
  spacingScale,
  radiusScale,
  elevationScale,
  componentSpecs,
} from "@/data/designSystem";
import { featuredProducts, footerBannerCTA } from "@/data/home";

const spec = (id) => componentSpecs.find((item) => item.id === id) ?? {};

export default function StyleGuide() {
  const sampleProduct = featuredProducts.items[0];

  return (
    <>
      <header className="sb-gradient-hero sb-ds-hero sb-section">
        <Row className="align-items-end g-4">
          <Col lg={8}>
            <Logo />
            <p className="sb-meta mt-2 mb-3">{foundationsMeta.subtitle}</p>
            <h1 className="sb-h1 mb-3">{foundationsMeta.description}</h1>
            <div className="d-flex flex-wrap gap-2">
              {foundationsMeta.specs.map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>
          </Col>
          <Col lg={4}>
            <Card flat className="p-4">
              <div className="sb-eyebrow mb-2">Foundations</div>
              <p className="sb-small text-secondary mb-0">
                Every value below is a live CSS custom property from App.css.
                Click a swatch to copy its hex.
              </p>
            </Card>
          </Col>
        </Row>
      </header>

      <div className="sb-section">
        <Row className="g-5">
          <Col lg={3} xl={2}>
            <nav className="sb-ds-nav" aria-label="Design system sections">
              <div className="sb-eyebrow mb-3">On this page</div>
              {sections.map(({ id, label }) => (
                <a key={id} href={`#${id}`}>
                  {label}
                </a>
              ))}
            </nav>
          </Col>

          <Col lg={9} xl={10}>
            <SpecSection
              id="colors"
              eyebrow="Color tokens"
              title="Palette"
              hint="Semantic names first — surface, text, accent, status."
            >
              {colorGroups.map(({ title, tokens }) => (
                <div key={title} className="mb-4">
                  <div className="sb-small text-secondary mb-3">{title}</div>
                  <Row xs={2} md={3} xl={4} className="g-3">
                    {tokens.map((token) => (
                      <Col key={token.name}>
                        <TokenSwatch token={token} />
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </SpecSection>

            <SpecSection
              id="typography"
              eyebrow="Typography — Inter"
              title="Type scale"
              hint="Seven steps, negative tracking above 24px."
            >
              <Card className="p-4 p-lg-5">
                {typeScale.map(({ label, className, sample }) => (
                  <SpecimenRow key={label} label={label}>
                    <div className={className}>{sample}</div>
                  </SpecimenRow>
                ))}
              </Card>
            </SpecSection>

            <Row className="g-4 mb-5">
              <Col lg={6}>
                <Card id="spacing" className="sb-ds-anchor p-4 h-100">
                  <div className="sb-eyebrow mb-4">Spacing (4pt base)</div>
                  <div className="d-flex align-items-end gap-3">
                    {spacingScale.map(({ step }) => (
                      <div className="sb-spacing-slot" key={step}>
                        <div style={{ width: step, height: step }}>
                          <div className="sb-spacing-bar" />
                        </div>
                        <span className="sb-caption">{step}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>

              <Col lg={6}>
                <Card id="radius" className="sb-ds-anchor p-4 h-100">
                  <div className="sb-eyebrow mb-4">Radius</div>
                  <div className="d-flex flex-wrap align-items-end gap-3">
                    {radiusScale.map(({ name, value }) => (
                      <div className="sb-spacing-slot" key={name}>
                        <div
                          className="sb-radius-box"
                          style={{ borderRadius: value }}
                        />
                        <span className="sb-caption">{name}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>

            <SpecSection
              id="elevation"
              eyebrow="Elevation & gradient"
              title="Depth"
              hint="Two shadow steps, one glass overlay, one brand gradient."
            >
              <Row xs={1} sm={2} lg={4} className="g-4">
                {elevationScale.map(({ name, className, hint }) => (
                  <Col key={name}>
                    <div className="sb-card-flat sb-checker p-3">
                      <div className={`sb-elevation-tile ${className}`} />
                    </div>
                    <div className="sb-small mt-3">{name}</div>
                    <div className="sb-caption">{hint}</div>
                  </Col>
                ))}
              </Row>
            </SpecSection>

            <SpecSection
              id="components"
              eyebrow="Components"
              title={spec("buttons").title}
              hint={spec("buttons").hint}
            >
              <Card className="p-4">
                <SpecimenRow label="Primary">
                  <div className="d-flex flex-wrap align-items-center gap-3">
                    <Button
                      variant="primary"
                      className="rounded-pill fw-semibold px-4"
                    >
                      Start chatting
                    </Button>
                    <Button
                      variant="primary"
                      className="rounded-pill fw-semibold px-4"
                      disabled
                    >
                      Disabled
                    </Button>
                    <IconButton aria-label="Send">
                      <i className="bi bi-arrow-up" />
                    </IconButton>
                  </div>
                </SpecimenRow>
                <SpecimenRow label="Secondary">
                  <div className="d-flex flex-wrap align-items-center gap-3">
                    <button type="button" className="sb-pill">
                      <i className="bi bi-stars" /> Ask the AI
                    </button>
                    <Chip>Compare all 3</Chip>
                    <Chip>
                      <i className="bi bi-headphones" /> Headphones under $150
                    </Chip>
                  </div>
                </SpecimenRow>
              </Card>
            </SpecSection>

            <SpecSection
              title={spec("badges").title}
              hint={spec("badges").hint}
            >
              <Card className="p-4">
                <SpecimenRow label="Variants">
                  <div className="d-flex flex-wrap align-items-center gap-3">
                    <Badge>
                      <i className="bi bi-stars" /> AI pick
                    </Badge>
                    <GradientBadge>Step 1</GradientBadge>
                    <Badge variant="outline">Free shipping</Badge>
                    <Badge variant="success">
                      <i className="bi bi-circle-fill sb-glyph" /> Online
                    </Badge>
                  </div>
                </SpecimenRow>
                <SpecimenRow label="Brand & identity">
                  <div className="d-flex flex-wrap align-items-center gap-4">
                    <Logo />
                    <Logo withText={false} />
                    <Avatar name="Rani" />
                    <span className="sb-meta">
                      <i className="bi bi-star-fill sb-star" /> 4.8 · 128
                      reviews
                    </span>
                  </div>
                </SpecimenRow>
              </Card>
            </SpecSection>

            <SpecSection
              title={spec("inputs").title}
              hint={spec("inputs").hint}
            >
              <Card className="p-4">
                <SpecimenRow label="Composer">
                  <PromptInput placeholder="Ask me anything…" />
                </SpecimenRow>
                <SpecimenRow label="Search">
                  <SearchField />
                </SpecimenRow>
              </Card>
            </SpecSection>

            <SpecSection
              title={spec("surfaces").title}
              hint={spec("surfaces").hint}
            >
              <Row xs={1} md={2} lg={3} className="g-4">
                <Col>
                  <Card className="p-4 h-100">
                    <div className="sb-h3">Surface card</div>
                    <p className="sb-meta mb-0 mt-1">
                      White on base, 1px subtle border, radius lg.
                    </p>
                  </Card>
                </Col>
                <Col>
                  <Card flat className="p-4 h-100">
                    <div className="sb-h3">Flat card</div>
                    <p className="sb-meta mb-0 mt-1">
                      Base fill for nested or secondary blocks.
                    </p>
                  </Card>
                </Col>
                <Col>
                  <ProductCard product={sampleProduct} />
                </Col>
              </Row>
            </SpecSection>

            <SpecSection
              title={spec("conversation").title}
              hint={spec("conversation").hint}
            >
              <Row className="g-4 align-items-start">
                <Col lg={5}>
                  <Card className="p-4">
                    <div className="d-flex flex-column gap-3">
                      <div className="sb-bubble sb-bubble-user">
                        I need wireless headphones under $150
                      </div>
                      <div className="sb-bubble sb-bubble-ai">
                        Here are 3 with strong noise cancelling.
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col lg={7}>
                  <ChatPreview />
                </Col>
              </Row>
            </SpecSection>

            <SpecSection title={spec("cta").title} hint={spec("cta").hint}>
              <div className="d-flex flex-column gap-4">
                <CtaBanner />
                <CtaBanner data={{ ...footerBannerCTA, tone: "dark" }} />
              </div>
            </SpecSection>
          </Col>
        </Row>
      </div>
    </>
  );
}
