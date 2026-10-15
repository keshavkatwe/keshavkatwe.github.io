export type Story = {
  problem: string; ownership: string; scope: string; outcome: string;
  results: { value: string; label: string }[];
  decisions: { title: string; built: string; significance: string }[];
  flowTitle: string; flowNote: string;
  flow: { title: string; detail: string }[];
  evidence: string;
};
export const stories: Record<string, Story> = {
  pushwing: {
    problem: 'Publishing from an AI client is more than an upload call. The user needs to connect the right account, understand what will happen, and follow a job that continues after the request has finished. Those states need to make sense in a dashboard as well as through MCP tools.',
    ownership: 'I built Pushwing from scratch: the React/TypeScript dashboard, API, hosted MCP server, shared services, provider integrations and background workers. My frontend work covers account connections, publishing jobs, usage and activity.',
    scope: 'Independent product · End-to-end ownership',
    outcome: 'A working publishing product with a shared foundation for dashboard and AI-client workflows.',
    results: [{value:'React + TypeScript',label:'Dashboard and reusable UI'},{value:'API + MCP',label:'Two interfaces, shared services'},{value:'Async by design',label:'PostgreSQL-backed publishing jobs'}],
    decisions: [
      {title:'Make server state a first-class UI concern',built:'I used TanStack Query for dashboard data and an OpenAPI-generated API client, alongside reusable interface components.',significance:'Account connections and publishing jobs are changing server state. A typed client keeps the API contract explicit; query-based data handling gives those screens a consistent foundation.'},
      {title:'Share the workflow, not just the types',built:'The dashboard/API and MCP tools use a shared service layer for account, media, publishing-job and provider operations.',significance:'A user can enter through a visual interface or an AI client. Shared services put the core publishing behaviour behind both entry points.'},
      {title:'Separate the request from the publishing work',built:'I implemented PostgreSQL-backed jobs with pg-boss, provider integrations, OAuth, token-refresh workers and audit logging.',significance:'The frontend needs a job to follow, rather than tying the whole experience to one long-running HTTP request. Usage and activity views make the background work understandable.'}
    ],
    flowTitle:'Follow a publishing workflow',flowNote:'Conceptual map of the implemented components. Select a step to explore it; this is not a live publishing request.',
    flow:[{title:'Connect',detail:'OAuth connects a provider account. The React dashboard exposes account-connection state.'},{title:'Request',detail:'A dashboard/API request or an MCP tool invokes the publishing workflow through shared services.'},{title:'Process',detail:'PostgreSQL-backed pg-boss jobs and background workers perform the asynchronous provider work.'},{title:'Inspect',detail:'Publishing-job, usage and activity interfaces expose the work to the user, supported by audit logging.'}],
    evidence:'The public product and existing walkthrough are available below. Pushwing is in early access: YouTube uploads remain private while API review is pending, and Instagram access is invite-only. No adoption or performance benchmark is claimed here.'
  },
  agenvik: {
    problem:'A useful support or lead-capture agent needs more than a prompt. It needs the right organisation’s context, a stable identity across incoming messages, and conversation state that survives a process restart. The surrounding product also needs to make knowledge and agent configuration understandable.',
    ownership:'I architected the LangGraph-based conversational platform and built its channel-identity, tenant-isolation and durable-state foundations. The platform uses Bun, Elysia, Drizzle and PostgreSQL, with WhatsApp Business API and Slack integrations.',
    scope:'Independent product · Agent and platform architecture',
    outcome:'An agent platform that combines channel integrations with persistent, organisation-scoped conversations.',
    results:[{value:'Multi-channel',label:'WhatsApp Business API + Slack'},{value:'Durable state',label:'PostgresSaver checkpoints'},{value:'Tenant isolation',label:'Per-organisation context'}],
    decisions:[
      {title:'Normalize identity before running the agent',built:'I implemented channel-identity normalization and per-organisation tenant isolation.',significance:'A channel-specific sender ID is only one part of the conversation context. Organisation and identity boundaries need to be established before the agent handles the message.'},
      {title:'Persist the conversation, not just the transcript',built:'I used LangGraph with PostgresSaver checkpointing for durable multi-turn state across restarts.',significance:'Checkpointed execution gives subsequent turns a persistent state foundation. Conversation continuity does not depend on one in-memory process staying alive.'},
      {title:'Treat extracted data as untrusted input',built:'I designed intent-detection and entity-injection pipelines with prompt-injection safeguards for LLM-extracted user data.',significance:'Model output can carry user-controlled content. The boundary between extracted entities and agent instructions deserves explicit handling.'}
    ],
    flowTitle:'Trace a conversation through the system',flowNote:'Conceptual architecture based on the implemented platform. The public dashboard image below contains demo workspace data.',
    flow:[{title:'Receive',detail:'Messages arrive through WhatsApp Business API or Slack, with each channel’s own identity format.'},{title:'Resolve',detail:'Channel identities are normalized and the organisation boundary supplies the appropriate tenant context.'},{title:'Run',detail:'LangGraph runs the conversation workflow, including intent detection and entity handling with safeguards.'},{title:'Persist',detail:'PostgresSaver checkpoints keep multi-turn state durable across process restarts.'}],
    evidence:'The public product page and developer guide provide a view into the product. The pictured Northstar Help Desk workspace is published demo content, not a customer account. No customer-volume, accuracy or latency figures are claimed.'
  },
  investsky: {
    problem:'A financial mobile app has to make dense data, dynamic forms and long lists feel coherent on a small screen. The rebuild needed a common UI foundation across Android and iOS, with performance and release ownership treated as part of the same engineering problem.',
    ownership:'As the sole mobile-app architect, I owned architecture, delivery and release end to end. I led the ground-up React Native rebuild and built the shared UI foundations, schema-driven forms and custom financial charting components.',
    scope:'InvestSky · Lead Software Development Engineer · May 2023–Dec 2024',
    outcome:'A ground-up mobile rebuild with a shared design system, reusable product primitives and reported improvements in performance and engagement.',
    results:[{value:'80%',label:'Reported performance improvement'},{value:'20%',label:'Reported engagement lift from launches'},{value:'iOS + Android',label:'Architecture through release'}],
    decisions:[
      {title:'Make the design system the foundation of the rebuild',built:'I rebuilt the app around a Styled Components-driven design system.',significance:'Shared primitives give financial screens a common visual language. The architecture supports consistency across the two mobile platforms without rebuilding each screen’s foundations.'},
      {title:'Give lists, data and animation dedicated tools',built:'I adopted TanStack Query, FlashList and Reanimated for server data, high-performance lists and animation.',significance:'These are different concerns with different performance characteristics. The rebuild gave each an explicit place in the frontend architecture.'},
      {title:'Turn recurring product patterns into systems',built:'I built a JSON-schema-driven form engine and custom charting components for financial data.',significance:'Configuration-driven forms provide a reusable way to express changing field structures. Custom charting components address the presentation needs of financial data.'}
    ],
    flowTitle:'Explore the mobile foundations',flowNote:'Conceptual view of the frontend responsibilities. No proprietary screens, code or internal architecture documents are reproduced.',
    flow:[{title:'UI foundation',detail:'Styled Components-driven design-system primitives underpin the ground-up React Native rebuild.'},{title:'Data & motion',detail:'TanStack Query manages server data; FlashList and Reanimated support performant lists and animated interfaces.'},{title:'Product systems',detail:'JSON-schema-driven forms and custom financial charts express recurring financial-product patterns.'},{title:'Release',detail:'I owned architecture, delivery and release end to end across Android and iOS.'}],
    evidence:'The 80% performance improvement and 20% engagement lift are results reported in my résumé. Benchmark methodology and internal analytics are not reproduced here. The portfolio phone graphic is an original interaction study, not an InvestSky screen.'
  },
  sense: {
    problem:'Frontend quality depends on more than individual screens. Deployment time, form reliability, flow logic and inconsistent tooling all affect how a team ships. My work at Sense combined hands-on engineering with practices that could spread across teams.',
    ownership:'I managed three frontend teams of three engineers each and contributed as an individual engineer on one of them. I owned code-review standards, technical solutioning and company-wide code-quality decisions, alongside deployment and frontend tooling work.',
    scope:'Sense · Engineering Manager & hands-on engineer · Apr 2025–Jul 2026',
    outcome:'Faster deployments, lower infrastructure cost and fewer form bugs, supported by shared tooling and hands-on adoption.',
    results:[{value:'20 min → <60 sec',label:'Reported deployment time'},{value:'70%',label:'Reported AWS cost reduction'},{value:'80%',label:'Reported reduction in form bugs'}],
    decisions:[
      {title:'Improve the delivery system itself',built:'I redesigned the S3-based deployment architecture. Reported deployment time fell from around 20 minutes to under 60 seconds, alongside a 70% AWS cost reduction and 30–80% performance improvement.',significance:'Deployment speed and infrastructure cost were addressed together at the architecture level. The internal topology and measurement data are not reproduced in this public case study.'},
      {title:'Pair a form standard with an adoption process',built:'I introduced React Hook Form and Zod organisation-wide, with adoption sessions and pairing involving nearly every engineer.',significance:'The work included both implementation and helping engineers use the new approach. Form-related bugs fell by a reported 80%.'},
      {title:'Make complex flows and everyday tooling explicit',built:'I introduced XState for flow-based application logic and modernized the toolchain to Vite and Biome. I also contributed to architecting an organisation-wide AI code-fixing tool.',significance:'State-machine-based flow logic, shared review standards and common tooling gave teams more consistent engineering foundations. The AI tool was a contribution, not a sole-authorship project.'}
    ],
    flowTitle:'From local improvement to shared practice',flowNote:'A map of my contribution areas, not a reproduction of Sense’s deployment pipeline.',
    flow:[{title:'Delivery',detail:'S3-based deployment architecture redesigned; reported deploy time improved from 20 minutes to under 60 seconds.'},{title:'Forms',detail:'React Hook Form and Zod introduced with hands-on adoption sessions and pairing; reported form bugs reduced by 80%.'},{title:'Flow logic',detail:'XState introduced to make flow-based application logic explicit through state-machine design.'},{title:'Team practice',detail:'Vite, Biome, review standards and technical solutioning helped spread common practices across the organisation.'}],
    evidence:'All numerical outcomes are candidate-reported from my approved résumés. The before/after comparison describes results; it does not imply a specific unpublished infrastructure topology. No employer code, internal screenshot or customer data is included.'
  }
};
