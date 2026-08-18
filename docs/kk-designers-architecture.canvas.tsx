import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Stack,
  Stat,
  Table,
  Text,
  useHostTheme,
} from "cursor/canvas";

const LAYERS = [
  {
    layer: "Visitor browser",
    owns: "Lenis scroll, mailto draft, Behold fetch",
    notes: "No login. All conversion happens here.",
  },
  {
    layer: "React SPA (product)",
    owns: "frontend/src/components/kk/*",
    notes: "Single long page. App.js is the router.",
  },
  {
    layer: "Emergent template",
    owns: "shadcn/ui, QueryClient, CRACO, visual-edits",
    notes: "Present in the repo; mostly unused by the site.",
  },
  {
    layer: "FastAPI + Mongo",
    owns: "POST /api/enquiry, /api/status",
    notes: "Enquiry API is implemented but not called by Contact.jsx.",
  },
  {
    layer: "External services",
    owns: "Pexels/Unsplash, Behold, Emergent Email",
    notes: "Images hotlinked. Email only if API is reconnected.",
  },
];

const FEATURES = [
  {
    feature: "Kinetic hero + compare slider",
    status: "Live",
    purpose: "Prove 3D-render fidelity vs real site",
  },
  {
    feature: "About / services / philosophy",
    status: "Live",
    purpose: "Position studio and founder",
  },
  {
    feature: "3-tab portfolio (bento grids)",
    status: "Live",
    purpose: "Process + highlights without case-study routes",
  },
  {
    feature: "Consultation form (mailto)",
    status: "Live",
    purpose: "Lead to kkdesigners15@gmail.com via visitor mail app",
  },
  {
    feature: "Instagram chapter",
    status: "Live / fallback",
    purpose: "Studio social proof; Behold optional",
  },
  {
    feature: "POST /api/enquiry + Mongo + email",
    status: "Dormant",
    purpose: "Server-side persist + notify (not wired to form)",
  },
  {
    feature: "WhatsApp float / wa.me",
    status: "Removed",
    purpose: "Replaced after owner request",
  },
  {
    feature: "Auth, CMS, payments",
    status: "Not in product",
    purpose: "Template leftovers only",
  },
];

const SECTIONS = [
  { id: "00", name: "Navbar", job: "Hash nav + Book CTA" },
  { id: "01", name: "Hero", job: "Claim + slider + CTAs" },
  { id: "—", name: "Ribbon", job: "Brand marquee" },
  { id: "02", name: "About", job: "Founder proof" },
  { id: "—", name: "Services", job: "Four offerings" },
  { id: "03", name: "Portfolio", job: "Tabs / tetris grid" },
  { id: "04", name: "Philosophy", job: "Editorial quote" },
  { id: "05", name: "Contact", job: "mailto enquiry" },
  { id: "06", name: "Instagram", job: "6-tile feed" },
  { id: "—", name: "Footer", job: "Email + IG" },
];

export default function KkDesignersArchitecture() {
  const theme = useHostTheme();

  return (
    <Stack gap={24}>
      <Stack gap={8}>
        <Row gap={8} align="center">
          <Pill tone="info">Architecture review</Pill>
          <Pill>SPA + unused API</Pill>
        </Row>
        <H1>K K Designers — system design</H1>
        <Text tone="secondary">
          Marketing portfolio for an interior studio in Pune. Built on the
          Emergent FastAPI / React / Mongo / shadcn template. The product is
          the kk/ section tree; most of the template is unused.
        </Text>
      </Stack>

      <Grid columns={4} gap={12}>
        <Stat value="1 page" label="Visitor routes" />
        <Stat value="mailto" label="Live lead path" tone="warning" />
        <Stat value="4" label="Services on site" />
        <Stat value="Dormant" label="Enquiry API" tone="warning" />
      </Grid>

      <Callout tone="warning" title="Do not treat the backend as live conversion">
        Contact.jsx opens a mailto draft. POST /api/enquiry still writes Mongo
        and sends Emergent email, but the form never calls it after the
        validation / email outage in PRD round 4.
      </Callout>

      <Stack gap={8}>
        <H2>Problem this site exists to solve</H2>
        <Text>
          Convert Pune homeowners and villa clients who need to trust that a
          photorealistic 3D render will match on-site execution. The site
          sells process (raw → handover) and a single consultation action —
          not a multi-tenant website builder.
        </Text>
      </Stack>

      <Stack gap={8}>
        <H2>Runtime layers</H2>
        <Table
          headers={["Layer", "Owns", "Engineer note"]}
          rows={LAYERS.map((r) => [r.layer, r.owns, r.notes])}
          rowTone={LAYERS.map((_, i) => (i === 3 ? "warning" : undefined))}
        />
        <Text tone="secondary" size="small">
          Source: repository tree and server.py / App.js / Contact.jsx ·
          reviewed 2026-08-19
        </Text>
      </Stack>

      <Grid columns={2} gap={16}>
        <Card>
          <CardHeader>What the template gives you</CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Text>
                CRA + CRACO, Tailwind, full Radix/shadcn kit, TanStack Query,
                Motor/Mongo, CORS, Emergent visual-edits in dev, optional
                webpack health plugin.
              </Text>
              <Text tone="secondary">
                Think “batteries-included starter image”, not a page-builder
                SDK. You edit React, not a site schema.
              </Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>What the product actually is</CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Text>
                Section-composed SPA in frontend/src/components/kk. Content
                CMS is data.js. Founder photo is /founder.jpg. No React
                Router in App.js.
              </Text>
              <Text tone="secondary">
                Extending the brand = new kk component + App.js mount +
                navbar hash. Extending leads = rewire Contact to /api/enquiry.
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Stack gap={8}>
        <H2>Page composition (App.js order)</H2>
        <Table
          headers={["Chapter", "Section", "Job"]}
          rows={SECTIONS.map((s) => [s.id, s.name, s.job])}
        />
      </Stack>

      <Stack gap={8}>
        <H2>Feature inventory</H2>
        <Table
          headers={["Feature", "Status", "Purpose"]}
          columnAlign={["left", "left", "left"]}
          rows={FEATURES.map((f) => [f.feature, f.status, f.purpose])}
          rowTone={FEATURES.map((f) =>
            f.status === "Live"
              ? "success"
              : f.status === "Dormant" || f.status === "Removed"
                ? "warning"
                : undefined,
          )}
        />
      </Stack>

      <Stack gap={8}>
        <H2>Lead-capture history</H2>
        <Grid columns={3} gap={12}>
          <Card>
            <CardHeader trailing={<Pill size="sm">Round 1</Pill>}>
              WhatsApp
            </CardHeader>
            <CardBody>
              <Text>wa.me prefilled message. Fast on mobile. Later removed.</Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill size="sm" tone="warning">Round 3</Pill>}>
              API + email
            </CardHeader>
            <CardBody>
              <Text>
                FastAPI stores enquiries and emails the owner via Emergent /
                Resend-style gateway.
              </Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill size="sm" tone="info">Now</Pill>}>
              mailto
            </CardHeader>
            <CardBody>
              <Text>
                Zero infra. Fails if the visitor has no mail client. API remains
                for a future reconnect.
              </Text>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      <Stack gap={8}>
        <H2>Engineering risks</H2>
        <Grid columns={2} gap={12}>
          <Stack gap={6}>
            <H3>Content & assets</H3>
            <Text tone="secondary">
              Portfolio still hotlinks Unsplash/Pexels. Behold feed ID is
              unset unless REACT_APP_BEHOLD_FEED_ID is provided.
            </Text>
          </Stack>
          <Stack gap={6}>
            <H3>Bundle & motion</H3>
            <Text tone="secondary">
              Unused shadcn stack ships in dependencies. Reveal ignores
              prefers-reduced-motion despite the design brief.
            </Text>
          </Stack>
          <Stack gap={6}>
            <H3>If you restore the API</H3>
            <Text tone="secondary">
              Enquiry.phone min_length is 5. Short numbers and email-gateway
              failures produced the original “Something went wrong” report.
            </Text>
          </Stack>
          <Stack gap={6}>
            <H3>Security posture</H3>
            <Text tone="secondary">
              No auth. CORS can be *. Email HTML is scanned for phishing
              patterns. Current form never sends that traffic.
            </Text>
          </Stack>
        </Grid>
      </Stack>

      <Text tone="secondary" size="small">
        Full write-up: docs/architecture.md · PRD history: memory/PRD.md ·
        Host theme kind: {theme.kind}
      </Text>
    </Stack>
  );
}
