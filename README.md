# CSV Editor - React App

A modern CSV editor built with React, Tailwind CSS, and shadcn/ui components for handling large datasets (10,000+ rows).

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/csv-editor-react.git
cd csv-editor-react

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Alternative Setup (From Scratch)

```bash
# Create new React project with Vite
npm create vite@latest csv-editor-react -- --template react
cd csv-editor-react

# Install base dependencies
npm install

# Install additional packages
npm install lucide-react clsx tailwind-merge

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Setup shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input select alert card badge separator

# Start development server
npm run dev
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
csv-editor-react/
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── CSVEditor.jsx       # Main component
│   │   ├── FileUpload.jsx      # File upload
│   │   ├── TableControls.jsx   # Search & filters
│   │   └── DataTable.jsx       # Data table
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.md
```

## 🎯 Usage

1. **Upload CSV** or **Generate Sample Data** (10,000 rows)
2. **Search** and **filter** data
3. **Click cells** to edit
4. **Download** your edited CSV

That's it! 🎉