# Lionel's Space Adventure

A fun space shooter game where you control Lionel the labradoodle collecting treats and shooting lasers at enemy ships. Playable on both desktop and mobile devices!

## Features

- Responsive design for both desktop and mobile
- Touch/swipe controls for mobile, mouse tracking for desktop
- Power-up system with different dog treats
- Progressive difficulty with levels
- Global leaderboard
- High score tracking
- Sound effects and background music

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/lionels-space-adventure.git
cd lionels-space-adventure
```

2. Install dependencies:
```bash
npm install
```

## Development

To run the game in development mode:
```bash
npm run dev
```
This will start a development server at `http://localhost:9000`

## Building for Production

To create a production build:
```bash
npm run build
```
The built files will be in the `dist` directory.

To run the production build locally:
```bash
npm start
```
This will start the server at `http://localhost:3002`

## Deployment

### Deploying to Heroku

1. Create a Heroku account if you don't have one yet
2. Install the Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
3. Login to Heroku:
```bash
heroku login
```
4. Create a new Heroku app:
```bash
heroku create lionels-space-adventure
```
5. Add Git remote for Heroku:
```bash
heroku git:remote -a lionels-space-adventure
```
6. Deploy to Heroku:
```bash
git push heroku main
```
7. Open the deployed app:
```bash
heroku open
```

## Controls

### Desktop
- Move: Mouse tracking
- Shoot: Click mouse button

### Mobile
- Move: Swipe on screen
- Shoot: Tap screen

## Power-ups

- Red Treat: Speed boost
- Blue Treat: Double shot
- Green Treat: Shield
- Gold Treat: Combo (activates all power-ups)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 