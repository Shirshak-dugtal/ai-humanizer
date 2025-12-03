# Placeholder Assets

This folder contains placeholder files for development. Replace these with your actual assets:

## Lottie Animations

Download Lottie JSON files from:
- [Iconscout UI/UX Animations](https://iconscout.com/lottie-animations/ui-ux-design)
- [LottieFiles Free Animations](https://lottiefiles.com/free-animations/ui)

Replace the placeholder animations in `src/components/LottiePlayer.tsx`:

1. **hero-animation.json** - Main hero section animation
2. **loading-animation.json** - Processing/loading states
3. **success-animation.json** - Success feedback
4. **upload-animation.json** - File upload interactions

## Images

Add any additional images here:
- Logo variations (SVG preferred)
- Hero images
- Feature illustrations
- Avatar placeholders

## Icons

The project uses Lucide React icons by default. Add custom SVG icons here if needed.

## Fonts

Custom fonts can be added here and imported in `src/index.css`.

## Usage

To use assets:
```typescript
import heroAnimation from '@/assets/seed/hero-animation.json'
import { LottiePlayer } from '@/components/LottiePlayer'

<LottiePlayer src={heroAnimation} width={400} height={400} />
```