# HumanifyMe Frontend

A modern React + TypeScript frontend for the HumanifyMe AI text humanizer, featuring a beautiful UI with GSAP animations, TailwindCSS styling, and integration with Hasura GraphQL and n8n workflows.

## Features

- **Modern Stack**: React 18 + TypeScript + Vite
- **Stunning UI**: TailwindCSS with custom animations
- **Smooth Animations**: GSAP-powered logo animations and transitions
- **Interactive Components**: Lottie animations for enhanced UX
- **Authentication**: Complete signup/login flow with password validation
- **File Upload**: Support for PDF, DOCX, and TXT files
- **Real-time Processing**: Mock integration with n8n webhooks
- **GraphQL Ready**: Apollo Client setup for Hasura integration
- **Responsive Design**: Mobile-first approach with accessibility
- **Dashboard**: User history and job management
- **API Integration**: Ready for custom API key usage

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Logo.tsx        # Animated logo with dashed frame
│   ├── AuthForm.tsx    # Login/signup form with validation
│   ├── Button.tsx      # Styled button component
│   ├── Input.tsx       # Input with validation states
│   ├── Modal.tsx       # Animated modal component
│   ├── Toast.tsx       # Notification system
│   ├── FileUpload.tsx  # Drag & drop file upload
│   ├── LottiePlayer.tsx # Lottie animation wrapper
│   ├── Navbar.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   ├── HumanizeEditor.tsx # Text input and options
│   └── OutputCard.tsx  # Results display
├── pages/              # Page components
│   ├── Landing.tsx     # Homepage with hero
│   ├── auth/           # Authentication pages
│   ├── Humanize.tsx    # Main humanization tool
│   ├── Dashboard.tsx   # User dashboard
│   └── Plans.tsx       # Pricing and plans
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Authentication hook
├── utils/              # Utility functions
│   ├── api.ts          # API integration
│   ├── apollo.ts       # GraphQL client
│   ├── graphql.ts      # GraphQL queries
│   └── validation.ts   # Form validation
├── types/              # TypeScript definitions
│   └── index.ts        # Shared types
└── assets/             # Static assets
    └── seed/           # Placeholder files
```

## Lottie Animations

Replace placeholder animations in `src/components/LottiePlayer.tsx` with actual Lottie JSON files:

- **Hero Animation**: Download from [Iconscout](https://iconscout.com/lottie-animations/ui-ux-design) or [LottieFiles](https://lottiefiles.com/free-animations/ui)
- **Loading Animation**: For processing states
- **Success Animation**: For completion feedback

Place your Lottie JSON files in `src/assets/animations/` and update the imports.

## Styling & Theming

The project uses TailwindCSS with custom configurations:

- **Colors**: Primary purple theme with accent blue
- **Animations**: Custom keyframes for smooth transitions
- **Components**: Utility-first approach with component classes
- **Responsive**: Mobile-first breakpoints
- **Dark Mode**: Ready for future implementation

## GSAP Animations

- **Logo Animation**: Entrance animation with skew and scale
- **Page Transitions**: Smooth page load animations
- **Hover Effects**: Micro-interactions on buttons and cards
- **Modal Animations**: Smooth modal enter/exit
- **Accessibility**: Respects `prefers-reduced-motion`

## Backend Integration

### Hasura GraphQL

Configure your Hasura instance:

1. Set up PostgreSQL database
2. Create tables: `users`, `humanize_jobs`
3. Set up permissions and roles
4. Update `VITE_HASURA_GRAPHQL_ENDPOINT` in `.env`

### n8n Workflows

Set up n8n webhooks for:

1. **Text Humanization**: `/webhook/humanize`
2. **File Processing**: `/webhook/upload`
3. **Job Status Updates**: `/webhook/job-status`

Update `VITE_N8N_WEBHOOK_URL` in `.env`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: React and TypeScript rules
- **Prettier**: Consistent formatting
- **Imports**: Absolute imports with `@/` prefix

### Components

All components are:
- Fully typed with TypeScript
- Accessible with ARIA labels
- Responsive by default
- Animated with GSAP where appropriate

## Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy `dist/` folder** to your hosting provider

### Environment Variables for Production

```env
VITE_HASURA_GRAPHQL_ENDPOINT=https://your-hasura-endpoint.com/v1/graphql
VITE_HASURA_ADMIN_SECRET=your_production_secret
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
VITE_NODE_ENV=production
```

## Features Walkthrough

### Landing Page
- Animated logo with dashed frame
- Hero section with Lottie animation
- Feature cards with hover effects
- Pricing section with plan comparison

### Authentication
- Login/signup forms with validation
- Password strength meter
- Real-time validation feedback
- Remember me functionality

### Humanization Tool
- Split-screen editor layout
- File upload with drag & drop
- Real-time word count and readability
- Tone and humanization level options
- API key integration toggle

### Dashboard
- Job history with status indicators
- Statistics overview
- Re-run and delete actions
- Detailed job view modal

### Plans & Billing
- Interactive pricing cards
- Monthly/yearly toggle with savings
- Feature comparison matrix
- Mock API key generation

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Check the documentation
- Create an issue on GitHub
- Contact support@humanifyme.com