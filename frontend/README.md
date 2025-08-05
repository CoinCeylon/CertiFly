# Certifly Frontend

🎓 **Modern React-based frontend for blockchain-powered certificate verification**

A sleek, responsive web application built with React, TypeScript, and Tailwind CSS that provides intuitive interfaces for universities and the public to manage and verify academic certificates on the blockchain.

## 🌟 Overview

The Certifly frontend delivers a seamless user experience across three main portals:
- **Cardiff Met Portal** - Main university dashboard for processing certificate batches
- **Partner University Portals** - Interface for partner institutions to submit requests
- **Public Verification Portal** - Anyone can verify certificate authenticity

### Key Features

- 🎨 **Modern UI/UX**: Built with shadcn/ui components and Tailwind CSS
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- ⚡ **Real-time Updates**: Live data synchronization with backend APIs
- 🔒 **Secure Authentication**: Role-based access for different university portals
- 📊 **Interactive Dashboards**: Rich analytics and data visualization
- 🌐 **Multi-Portal Support**: Separate interfaces for different stakeholders
- 🎯 **Accessibility**: WCAG compliant interface design

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Certifly Frontend                        │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │    Home     │  │   Cardiff   │  │    Partner Univ     │  │
│  │   Portal    │  │   Portal    │  │     Portals         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Verification│  │ How It Works│  │    Analytics        │  │
│  │   Portal    │  │    Page     │  │    Dashboard        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              React Router + State Management            │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │         TanStack Query + Axios API Integration         │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │     Certifly Backend      │
                    │        (Port 3000)        │
                    └───────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Certifly Backend** running on port 8080

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CoinCeylon/CertiFly.git
   cd certifly/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the frontend root:
   ```env
   # Development Configuration
   VITE_API_BASE_URL=http://localhost:3000
   VITE_APP_TITLE=Certifly - Certificate Verification Platform
   
   # Production Configuration (when deploying)
   # VITE_API_BASE_URL=https://your-backend-domain.com
   
   # Feature Flags
   VITE_ENABLE_ANALYTICS=true
   VITE_ENABLE_NOTIFICATIONS=true
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will start on `http://localhost:8080`

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Build for development environment
npm run build:dev

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

## 📁 Project Structure

```
frontend/
├── public/                    # Static assets
│   ├── favicon.ico
│   ├── favicon.png
│   ├── placeholder.svg
│   ├── robots.txt
│   └── images/               # Public images
├── src/
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Application entry point
│   ├── index.css             # Global styles
│   ├── vite-env.d.ts         # TypeScript environment definitions
│   ├── assets/               # Application assets
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ...
│   │   ├── homePage/        # Home page components
│   │   ├── steps/           # Multi-step form components
│   │   ├── verificationPage/ # Verification page components
│   │   ├── AnalyticsTab.tsx # Analytics dashboard
│   │   ├── BatchMetadataForm.tsx # Batch submission form
│   │   ├── CertificatesTab.tsx # Certificate management
│   │   ├── Header.tsx       # Application header
│   │   ├── NetworkVisualizer.tsx # Network diagram
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   └── ...
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   │   └── utils.ts         # Common utilities
│   └── pages/                # Page components
│       ├── Home.tsx         # Landing page
│       ├── CardiffDashboard.tsx # Cardiff university portal
│       ├── VerificationPage.tsx # Public verification
│       ├── How-it-works.tsx # Platform explanation
│       ├── NotFound.tsx     # 404 error page
│       └── Index.tsx        # Page index
├── ICBTDashboard.tsx         # Partner university dashboard
├── components.json           # shadcn/ui configuration
├── eslint.config.js          # ESLint configuration
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── tsconfig.app.json         # App-specific TypeScript config
├── tsconfig.node.json        # Node.js TypeScript config
├── vite.config.ts            # Vite build configuration
└── README.md
```

## 🛠️ Technology Stack

### Core Technologies
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React component library
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful & consistent icon set
- **next-themes** - Theme management (dark/light mode)

### State Management & Data Fetching
- **TanStack Query** - Powerful data synchronization
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation

### Charts & Visualization
- **Recharts** - Composable charting library
- **Network Visualizer** - Custom blockchain network diagrams

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS post-processing
- **Autoprefixer** - CSS vendor prefixing

## 🎨 UI Components

### Custom Components

#### Dashboard Components
```tsx
// Analytics dashboard with charts
<AnalyticsTab />

// Certificate batch management
<BatchesTab />

// Real-time messaging display
<MessagesTab />

// Statistics cards
<StatsCards data={statsData} />
```

#### Forms & Input
```tsx
// Multi-step batch submission
<BatchSubmissionDialog />

// Student data input with CSV upload
<StudentInputTabs />

// Certificate metadata form
<BatchMetadataForm />
```

#### Visualization
```tsx
// Interactive network diagram
<NetworkVisualizer />

// Certificate details modal
<CertificateDetailsView certificate={cert} />
```

### shadcn/ui Components
- **Cards** - Information containers
- **Tables** - Data display with sorting/filtering
- **Dialogs** - Modal interactions
- **Forms** - Input validation and submission
- **Tabs** - Content organization
- **Buttons** - Action triggers
- **Toast** - Notifications

## 🌐 Routing Structure

```tsx
const routes = [
  {
    path: "/",
    element: <Home />,
    description: "Landing page with portal selection"
  },
  {
    path: "/cardiff-met",
    element: <CardiffDashboard />,
    description: "Cardiff Metropolitan University portal"
  },
  {
    path: "/icbt-campus",
    element: <ICBTDashboard />,
    description: "ICBT Campus partner portal"
  },
  {
    path: "/partner-university-b",
    element: <ICBTDashboard />,
    description: "Partner University B portal"
  },
  {
    path: "/verify",
    element: <VerificationPage />,
    description: "Public certificate verification"
  },
  {
    path: "/how-it-works",
    element: <HowItWorks />,
    description: "Platform explanation and workflow"
  }
];
```

## 🎯 Key Features

### 1. Multi-Portal Architecture
- **Cardiff Met Portal**: Certificate batch processing and approval
- **Partner Portals**: Request submission and certificate retrieval
- **Verification Portal**: Public certificate validation

### 2. Real-time Dashboard
- Live statistics and analytics
- Batch processing status
- Message exchange tracking
- Network activity visualization

### 3. Certificate Management
- Bulk CSV upload for student data
- Batch metadata configuration
- Individual certificate viewing
- PDF download functionality

### 4. Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop enhancement
- Cross-browser compatibility

### 5. Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode

## 🧪 Testing

### Component Testing
```bash
# Add testing framework (recommended)
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm run test
```

### End-to-End Testing
```bash
# Add Cypress or Playwright for E2E testing
npm install --save-dev cypress

# Run E2E tests
npm run cypress:open
```

## 🚀 Deployment

### Static Site Deployment

#### Azure Static Web Apps
```bash
# Build for production
npm run build

# Deploy to Azure (configured in staticwebapp.config.json)
# Automatic deployment via GitHub Actions
```

#### Netlify/Vercel
```bash
# Build command
npm run build

# Output directory
dist/

# Environment variables
VITE_API_BASE_URL=https://your-backend-domain.com
```

### Docker Deployment
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Configuration

#### Development
```env
VITE_API_BASE_URL=http://localhost:8080
```

#### Production
```env
VITE_API_BASE_URL=https://api.certifly.com
```

## 🎨 Theming & Customization

### Tailwind CSS Configuration
```typescript
// Custom color palette
theme: {
  extend: {
    colors: {
      primary: 'hsl(var(--primary))',
      secondary: 'hsl(var(--secondary))',
      success: 'hsl(var(--success))',
      warning: 'hsl(var(--warning))',
      destructive: 'hsl(var(--destructive))'
    }
  }
}
```

### Dark Mode Support
```css
/* Automatic dark mode detection */
@media (prefers-color-scheme: dark) {
  :root {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }
}
```

## 🔧 Development Guidelines

### Code Organization
- **Components**: Single responsibility, reusable
- **Pages**: Route-level components
- **Hooks**: Custom React hooks for business logic
- **Utils**: Pure functions and utilities

### TypeScript Best Practices
```typescript
// Define clear interfaces
interface CertificateData {
  id: string;
  studentName: string;
  university: string;
  hash: string;
  issuedAt: Date;
}

// Use proper typing for props
interface DashboardProps {
  university: 'cardiff' | 'partner';
  data: CertificateData[];
}
```

### Performance Optimization
- **Code Splitting**: React.lazy() for route-based splitting
- **Memoization**: React.memo() for expensive components
- **Query Optimization**: TanStack Query caching strategies
- **Bundle Analysis**: Use build tools to analyze bundle size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the coding standards
4. Add tests for new features
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Workflow
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Make changes and test
npm run lint

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

## 📝 License

CertiFly is free software released under the **GNU General Public License v3.0 or later**.  
See the full text in the [`LICENSE`](LICENSE) file or read it online at the GNU website.


## 🎯 Roadmap

- [ ] Mobile app development (React Native)
- [ ] PWA (Progressive Web App) capabilities
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Enhanced accessibility features
- [ ] Real-time notifications
- [ ] Offline mode support

---

**Built with ❤️ for the future of education technology**

*Powered by React, TypeScript, and modern web technologies*
