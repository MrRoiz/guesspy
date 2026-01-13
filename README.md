# Guesspy

A social deduction party game built with Next.js where players try to identify the spy (or spies) among them. Guesspy provides a fun, interactive experience for groups of friends.

## How to Play

1. **Setup**: Gather at least 3 players (the more, the merrier!)
2. **Configure**: Enter player names and set the number of spies
3. **Assign Roles**: Each player secretly checks their card to see if they're a spy or not
4. **Discuss**: Players have 2 minutes to ask questions and discuss to figure out who the spy is
5. **Guess**: After the timer runs out, players vote on who they think the spy is!

### Game Modes

- **Local Game**: Play in person by passing a single device around
- **Create Room** *(Coming Soon)*: Play remotely with friends online

## Features

- Configurable number of spies (fixed or random)
- 2-minute discussion timer with visual countdown
- Modern, clean UI with dark mode support
- Responsive design - works on desktop and mobile
- Secret role assignment for each player
- Card reveal animations for that extra suspense

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/guesspy.git
cd guesspy
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router and Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **State Management**: Jotai
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Code Quality**: Biome (linting & formatting)

## Game Rules

### Minimum Players
At least **3 players** are required to start a game.

### Number of Spies
- Choose a fixed number of spies
- Or enable "Random number of spies" for unpredictable fun!
  - Note: With random mode, sometimes everyone might be a spy!

### Discussion Time
Players have **2 minutes** to:
- Ask each other questions
- Share suspicions
- Build alliances
- Identify the spy

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

---

**Have fun playing Guesspy!**
