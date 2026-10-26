<div align="center">

# ⚡ Campus Energy Consumption Monitoring System

**An intelligent, multi-role web platform designed to eliminate campus electricity wastage, automate field maintenance, and drive grassroots sustainability.**

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/Status-Active%20Prototype-success?style=for-the-badge)](https://github.com/harsh01shrivastava-ui/Campus-energy-consumption-monitoroing-system-)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<br />

[Live Demo](#-getting-started--local-setup) • [Architecture](#-multi-role-architecture) • [Features](#-key-features--unique-twists) • [Installation](#-getting-started--local-setup) • [Roadmap](#-future-roadmap--enhancements)

</div>

---

## 📖 Overview & Concept

In higher education institutions, unoccupied lecture halls, computer labs, and auditorium complexes often run high-wattage air conditioning, fans, and projection systems hours after scheduled lectures conclude. This unmonitored power draw accounts for up to **30–45% of total institutional energy overhead** and generates avoidable Scope 2 carbon emissions.

The **Campus Energy Consumption Monitoring System** is an ultra-clean, minimal, single-page application that bridges the gap between students, facility crew, and campus administrators. 

### 💡 Core Pillars
1. **Grassroots Accountability:** Empower students and Class Representatives (CRs) to verify and shut down room loads via door QR codes upon leaving.
2. **Instant Field Dispatch:** Convert telemetry anomalies and student-reported issues into categorized, actionable maintenance tickets.
3. **Predictive Intelligence:** Transition from reactive checking to predictive forecasting, identifying seasonal baseline spikes before electricity bills arrive.
4. **Institutional Oversight:** Provide administrators with real-time financial savings estimates ($/₹), carbon offsets, and department leaderboards.

---

## 🏛️ Multi-Role Architecture

The application implements three dedicated, role-specific interfaces orchestrated through a synchronized, reactive state machine:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Top Navigation & Role Switcher                        │
└──────────────┬──────────────────────────────┬───────────────────────────────┘
               │                              │                               
               ▼                              ▼                               
┌──────────────────────────────┐┌──────────────────────────────┐┌──────────────▼──────────────┐
│  🎓 Student / Class Rep      ││  🔧 Maintenance Portal       ││  📊 Administrator Portal     │
├──────────────────────────────┤├──────────────────────────────┤├──────────────────────────────┤
│ • ExitCheck QR Scanner       ││ • Priority Action Queue      ││ • Executive KPI Summary Bar  │
│ • Real Webcam (html5-qrcode) ││ • Urgency Sorter (Crit/High) ││ • Projected Loss ($ / ₹)     │
│ • EcoBot Quick Reporter      ││ • Field-Focused Filter Map   ││ • EnergyPredict AI Forecast  │
│ • Class Scorecard & Badges   ││ • Smart Breaker Overrides    ││ • Department Leaderboard     │
│ • Streak & Points Multiplier ││ • Shift Handover Log         ││ • 48h Challenge Policies     │
└──────────────┬───────────────┘└──────────────┬───────────────┘└──────────────┬───────────────┘
               │                               │                               │
               └───────────────────────┬───────┴───────────────────────────────┘
                                       │
                                       ▼
               ┌───────────────────────────────────────────────┐
               │    Centralized Mock State (`mockData.js`)     │
               │  - Rooms & Appliances (Lights, Fans, AC, AV)  │
               │  - Live Overdraw Telemetry & Active Tickets   │
               │  - Cross-Portal Instant Synchronization       │
               └───────────────────────────────────────────────┘
```

### 1. 🎓 Student / Class Rep Portal (*The Grassroots Interface*)
*Focus: Frictionless exit protocols, gamification, and fast incident reporting.*
- **ExitCheck QR Scanner:** Real hardware webcam scanner component powered by `html5-qrcode`. Students scan physical QR code plaques affixed by classroom doorways to instantly verify room shutdown.
- **Interactive Walkthrough Checklist:** Five-point exit verification (*Lights, Fans, AC/HVAC, Projector/AV, Windows & Doors*). Submitting compliance immediately powers down active appliances in that room and updates the grid.
- **EcoBot Quick Reporter:** An intelligent slide-out chat drawer where students type natural language incident reports (e.g., *"Projector left running in Seminar Hall 2"*). EcoBot extracts the room, sets urgency, and routes a live ticket to field staff.
- **Class Sustainability Scorecard:** Tracks their class's cumulative eco-points, streak of compliant exits, and earned digital recognition badges (*Zero-Wastage Hero*, *Night Watchman*, *Green Pioneer*, *Rapid Resolver*).

### 2. 🔧 Maintenance Portal (*The Field & Task Queue Interface*)
*Focus: Urgency, field efficiency, and remote breaker controls.*
- **Priority Action Queue:** Sorted real-time ticket feed populated by submeter overdraw spikes and student EcoBot submissions. Tickets are prioritized by urgency (**Critical / High / Normal**) with quick-actions: *Mark Inspected*, *Assign Staff*, and *Resolve & Close*.
- **Field-Focused Campus Map:** A minimalist grid displaying **only rooms requiring active attention** (*Wasting Energy / Red status*) to eliminate visual clutter for technicians walking campus wings.
- **Appliance Override Drawer:** Allows staff to manually isolate individual circuits (Lights, Fans, AC, Projector) or trigger an emergency master cutoff.
- **Running Shift Handover Log:** Inter-shift communication log across Morning, Evening, and Night maintenance crews.

### 3. 📊 Administrator Portal (*The Executive & Analytical Interface*)
*Focus: Financial impact, predictive forecasting, and institutional policy.*
- **Executive Summary KPI Bar:** High-impact metric cards tracking:
  - *Estimated Money Wasted This Month ($/₹ toggle)*
  - *Total kWh Conserved via Checklists*
  - *Campus Carbon Footprint Reduction (% Scope 2 offset)*
  - *Overall Campus Compliance Rate*
- **Predictive Anomaly & Wastage Forecast (`EnergyPredict`):** Interactive **Recharts** visualizations displaying unmonitored baseline spikes during weekends, holidays, and post-hours vs optimized targets.
- **AI Energy Intelligence Banners:** Actionable policy recommendations (e.g., *"HVAC chiller setback timer audit"*) with one-click *"Apply Policy"* automation.
- **Department Leaderboard & Policy Controls:** Departmental rankings with verified exit rates, downloadable CSV compliance reports, and a button to trigger campus-wide energy sprint challenges.
- **System Settings:** Centralized controls for automated post-hours cutoff times, pre-exit notification timings, and target compliance benchmarks.

---

## 🛠️ Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) | Component-driven declarative UI architecture |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first CSS framework with tailored eco-slate palette |
| **Bundler & Tooling** | [Vite 6](https://vitejs.dev/) & [TypeScript](https://www.typescriptlang.org/) | Next-generation frontend tooling and type safety |
| **QR & Video** | [`html5-qrcode`](https://github.com/mebjas/html5-qrcode) | Real device camera integration for optical QR plaque recognition |
| **Data Visualization** | [Recharts](https://recharts.org/) | Composable, responsive SVG charts (Area, Bar, Linear curves) |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent, lightweight SVG iconography |
| **Micro-Animations** | [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti) | Celebratory exit verification particle animations |
| **State Layer** | Centralized Reactive Mock State | Single source of truth ensuring zero-latency updates across all 3 portals |

---

## 🚀 Key Features & Unique Twists

- **Integrated Webcam QR Scanner with Simulation Fallback:** Uses the device's optical sensor via `html5-qrcode` to scan doorway badges. If a webcam is unavailable or permission is denied, a dedicated **1-Click Simulation Fallback** allows developers to test instant scanning for any room.
- **Zero-Latency Cross-Portal State Sync:** When a student completes an ExitCheck or reports an anomaly via EcoBot:
  - The room immediately switches to **Green Normal**.
  - Active Wastage drops in real time.
  - The open ticket in the Maintenance Queue is automatically marked **Resolved**.
  - The Admin KPI bar reflects instantaneous financial and carbon savings.
- **Bilingual Currency Modeling ($ USD / ₹ INR):** Real-time conversion toggle allowing institutional users to view financial telemetry in either US Dollars or Indian Rupees.
- **Predictive Energy Forecasting:** Moves beyond static monitoring by utilizing historical variance data to highlight weekend/holiday load anomalies.

---

## 💻 Getting Started & Local Setup

Follow these steps to run the project locally on your machine:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` or `yarn` / `pnpm`

### Step 1: Clone the Repository
```bash
git clone https://github.com/harsh01shrivastava-ui/Campus-energy-consumption-monitoroing-system-.git
cd Campus-energy-consumption-monitoroing-system-
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start the Development Server
```bash
npm run dev
```

### Step 4: Open in Your Browser
Visit **[http://localhost:3000](http://localhost:3000)** (or the URL printed in your terminal).

### Step 5: Build for Production
To create an optimized production bundle:
```bash
npm run build
```

---

## 📂 Project Structure

```plaintext
Campus-energy-consumption-monitoroing-system-/
├── public/                     # Static assets and icons
├── src/
│   ├── components/
│   │   ├── common/             # Shared reusable primitives
│   │   │   ├── Navbar.tsx          # Top bar with status capsule & currency toggle
│   │   │   ├── RoleSwitcher.tsx    # Multi-role portal dropdown
│   │   │   ├── StatusBadge.tsx     # Color-coded positive/alert pills
│   │   │   └── Toast.tsx           # Floating notification stack
│   │   │
│   │   ├── student/            # Portal 1: Grassroots interface
│   │   │   ├── StudentDashboard.tsx # Portal coordinator & tab switcher
│   │   │   ├── ExitCheckScanner.tsx # html5-qrcode webcam feed & fallback controls
│   │   │   ├── QRChecklistModal.tsx # Interactive room appliance shutdown checklist
│   │   │   ├── EcoBotDrawer.tsx     # Collapsible incident reporting chat
│   │   │   └── ClassScorecard.tsx   # Eco-points, streaks, and digital badges
│   │   │
│   │   ├── maintenance/        # Portal 2: Field operations
│   │   │   ├── MaintenanceDashboard.tsx # Queue coordinator & quick shutoff
│   │   │   ├── MaintenanceQueue.tsx     # Priority task queue (Crit/High/Normal)
│   │   │   ├── FieldMap.tsx             # Wasting-only room grid
│   │   │   ├── ApplianceOverrideDrawer.tsx # Breaker toggle slide-over
│   │   │   └── ShiftNotes.tsx           # Shift handover logging
│   │   │
│   │   └── admin/              # Portal 3: Executive intelligence
│   │       ├── AdminDashboard.tsx       # Executive view coordinator
│   │       ├── KPIBar.tsx               # Financial, kWh, carbon, and compliance cards
│   │       ├── AnomalyCharts.tsx        # Recharts forecast curves & AI insights
│   │       ├── DepartmentLeaderboard.tsx# Cohort ranking & CSV export
│   │       └── SystemSettings.tsx       # Cutoff schedules & threshold configuration
│   │
│   ├── data/
│   │   ├── mockData.ts         # Centralized mutable campus rooms & tasks state
│   │   └── mockData.js         # Export compatibility layer
│   │
│   ├── types.ts                # TypeScript domain models and interfaces
│   ├── index.css               # Tailwind CSS theme and micro-animation keyframes
│   ├── App.tsx                 # Role-based conditional view routing
│   └── main.tsx                # React application entrypoint
│
├── index.html                  # HTML template with typography imports
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite configuration with Tailwind & React plugins
└── README.md                   # Comprehensive repository documentation
```

---

## 🔮 Future Roadmap & Enhancements

- [ ] **Physical IoT Smart Breaker Integration:** Connect submeter hardware via MQTT, Zigbee, or LoRaWAN gateways to actuate real physical relays.
- [ ] **Persistent Cloud Backend & WebSockets:** Migrate local mock state to a distributed backend (e.g., Supabase / Firebase / PostgreSQL) for synchronized multi-device operations.
- [ ] **Role-Based Authentication (SSO):** Integration with campus identity providers (Google Workspace / Microsoft Entra ID / SAML) to verify Class Representative student IDs.
- [ ] **Automated SMS & WhatsApp Alerts:** Send push alerts to custodial staff when unoccupied rooms remain energized for >60 minutes.
- [ ] **Thermal Camera & Motion Sensor Fusion:** Supplement door checklists with low-cost PIR motion sensors to automatically verify zero room occupancy.

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute it for academic or commercial sustainability initiatives.

---

<div align="center">
  <sub>Developed for the Campus Energy Telemetry & Sustainability Initiative. Built with clean code and care for the planet. 🌍</sub>
</div>
