   # Roulette Game - Junior Developer Assignment

   ## Overview

   Welcome to your technical assignment! We'd like you to build a **full-stack roulette game** using modern web technologies. This project will demonstrate your ability to:

   - Structure a TypeScript project across frontend and backend
   - Work with game rendering libraries (Phaser 3)
   - Design RESTful APIs
   - Use AI tools effectively for accelerated development

   **Time Allocated:** 5-7 days

   ---

   ## Context: Why This Assignment?

   We know you're proficient with AI-assisted development tools like Claude Code. This assignment is designed to be challenging enough that AI tools are **expected and encouraged**. We want to see:

   1. **How you architect** a non-trivial project
   2. **How you integrate** separate services (frontend/backend)
   3. **How you leverage AI** to write quality code quickly
   4. **How you document** your work for team collaboration

   ### What We Care About

   **Primary Focus:**
   - Game logic correctness (bet types, payouts, RNG)
   - API design and backend architecture
   - TypeScript usage and code quality
   - Frontend/backend integration

   **Not Required:**
   - User authentication or login system
   - User management or multiple accounts
   - Polished UI/UX (functional is fine)
   - Advanced animations or visual effects

   ---

   ## Project Requirements

   ### 🎯 Core Functionality

   Build a European roulette game (single-zero: 0-36) with:

   1. **Backend Service** (TypeScript required)
      - RESTful API for game operations
      - Balance management system
      - All standard roulette bet types (see Technical Spec document)
      - Provably fair random number generation
      - Game history tracking

   2. **Frontend Application** (TypeScript + Phaser 3 **required**)
      - Roulette wheel visualization with spin animation
      - Betting table with chip placement interface
      - All bet types supported through UI
      - Win/loss animations
      - Real-time balance display
      - Responsive design (desktop priority, mobile consideration)

   3. **Service Integration**
      - Frontend must call backend for all game logic
      - No game outcomes calculated client-side
      - Proper error handling and loading states

   ---

   ## Technical Requirements

   ### Mandatory Stack

   | Layer | Technology | Why |
   |-------|-----------|-----|
   | **Frontend** | Phaser 3 + TypeScript | Required for game rendering |
   | **Backend** | TypeScript (Node.js) | Framework choice is yours (Express, Fastify, NestJS, etc.) |
   | **Language** | TypeScript | Both services must use TypeScript |

   ### What You Choose

   You have **full creative freedom** on:

   - **Visual theme/styling** (modern casino, retro arcade, minimalist, fantasy - your choice!)
   - **Backend framework** (Express, Fastify, NestJS, or any TypeScript-compatible framework)
   - **Data storage** (In-memory, SQLite, file-based - persistence not required)
   - **Animation style** (realistic physics, arcade-style, abstract - make it yours!)
   - **Additional libraries** (UI frameworks for betting interface, state management, etc.)

   ---

   ## Deliverables

   - **Source code** in GitHub repository (public or invite us as collaborators)
   - **README** with setup instructions and design decisions
   - **Working demo** (deployed, video, or localhost instructions)

   ---

   ## Local Setup Guide

   Your README should include clear instructions for running the project locally. At minimum:

   **Backend:**
   ```bash
   cd backend
   npm install
   npm run dev  # or your start command
   # Should run on http://localhost:3001 (or specify port)
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev  # or your start command
   # Should run on http://localhost:3000 (or specify port)
   ```

   **Environment Variables:**
   Document any required environment variables (e.g., PORT, DATABASE_URL) with example values.

   ---

   ## What We'll Look At

   1. **Run your project locally** - Does it work? Can we set it up in under 5 minutes?
   2. **Place various bet types** - Do all bet types work correctly?
   3. **Verify payouts** - Are calculations accurate for all scenarios?
   4. **Test edge cases** - What happens with invalid bets, insufficient balance, etc.?
   5. **Review code structure** - Is the code well-organized and maintainable?
   6. **Check TypeScript usage** - Are types properly defined? Minimal use of `any`?
   7. **Read your documentation** - Can we understand your design decisions?
   8. **Assess game logic** - Is the backend logic sound and well-tested?

   ---

   **Good luck! We're excited to see what you build.**

   *Remember: This assignment is designed to be completed with AI assistance. We expect high-quality output because you have powerful tools at your disposal. Show us how you leverage modern development workflows.*
