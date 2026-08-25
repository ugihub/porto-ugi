# Creative Portfolio Website

A stunning, interactive portfolio website built with React, Vite, and modern animation libraries. Features a customizable theme system powered by Supabase.

![Portfolio Preview](https://via.placeholder.com/800x400?text=Creative+Portfolio)

## ✨ Features

- **🎨 Theme Customization** - Real-time color and font customization with save/share functionality
- **🎬 Rich Animations** - Powered by Framer Motion and GSAP
- **✨ Interactive Particles** - Mouse-reactive particle background
- **🖱️ Custom Cursor** - Animated cursor with hover effects
- **📱 Fully Responsive** - Works on all devices
- **🚀 Vercel Ready** - Optimized for deployment

## 🛠️ Tech Stack

- **React 18** - UI Framework
- **Vite** - Build Tool
- **Framer Motion** - React Animations
- **GSAP** - Advanced Animations
- **Supabase** - Database (Optional)
- **React Icons** - Icon Library

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd portofolio_new

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
npm run build
npm run preview
```

## 🎨 Theme Customization

Click the palette icon (🎨) in the navigation to open the Theme Customizer:

1. **Preset Themes** - Choose from 6 pre-designed color schemes
2. **Custom Colors** - Pick your own primary, secondary, and accent colors
3. **Animation Speed** - Adjust animation intensity
4. **Save & Share** - Save themes to Supabase or share via URL

## 📦 Supabase Setup (Optional)

For theme persistence, set up Supabase:

1. Create a new project at [supabase.com](https://supabase.com)
2. Run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100),
  colors JSONB NOT NULL,
  fonts JSONB,
  animation_speed FLOAT DEFAULT 1.0,
  created_at TIMESTAMP DEFAULT NOW(),
  view_count INT DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

-- Allow public read/insert
CREATE POLICY "Anyone can read themes" ON themes FOR SELECT USING (true);
CREATE POLICY "Anyone can create themes" ON themes FOR INSERT WITH CHECK (true);
```

3. Copy `.env.example` to `.env` and fill in your credentials:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🌐 Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Deploy

1. Push to GitHub
2. Import project in Vercel Dashboard
3. Add environment variables (if using Supabase)
4. Deploy!

### Environment Variables in Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📁 Project Structure

```
portofolio_new/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── CustomCursor/
│   │   ├── Navigation/
│   │   ├── ParticleBackground/
│   │   ├── ThemeCustomizer/
│   │   └── Footer/
│   ├── sections/
│   │   ├── Hero/
│   │   ├── About/
│   │   ├── Projects/
│   │   ├── Awards/
│   │   └── Contact/
│   ├── contexts/
│   │   └── ThemeContext.jsx
│   ├── lib/
│   │   └── supabase.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── .env.example
```

## 🎯 Customizing Content

Edit the following files to customize your portfolio:

- **Hero Section** - `src/sections/Hero/Hero.jsx`
- **About Section** - `src/sections/About/About.jsx`
- **Projects** - `src/sections/Projects/Projects.jsx`
- **Awards** - `src/sections/Awards/Awards.jsx`
- **Contact Info** - `src/sections/Contact/Contact.jsx`
- **Footer** - `src/components/Footer/Footer.jsx`

## 📄 License

MIT License - Feel free to use for personal and commercial projects.

---

Made with ❤️ using React + Vite
