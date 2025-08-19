# FFXI Challenge Timer & Tools


## Description

This repository contains a suite of tools for Final Fantasy XI, focused on tracking in-game events and progress. The main public tools are:

- **FFXI Challenge Timer**: Track the current Limited Time Challenge, time remaining, and upcoming challenges. Runs automatically and updates the UI in real time.
- **VanaTimer Web**: Displays Vana'diel time, next Vana-day, Tokyo midnight countdown, and Dynamis mob timers. Useful for planning in-game activities around Vana'diel time cycles.
- **Job Points Tracker**: Track your progress for all jobs, showing completion status and overall progress. Designed for easy job point management and visualization.



## How to Use

- Open the relevant HTML file in your browser (e.g., `index.html` for Challenge Timer, `vanatime.html` for VanaTimer, `job-tracker.html` for Job Points Tracker).
- No user interaction is required for Challenge Timer and VanaTimer; they update automatically.
- Job Points Tracker allows you to interactively track your job progress. Progress is stored in your browser.


## Notes

- All timers run in your current timezone and are calibrated to Japan Standard Time for FFXI event accuracy.
- Challenge Timer is calibrated for CatseyeXI server (approximate event times) and retail servers (true hour event times).


## Folder Structure

- HTML files are in the root directory.
- App-specific JS/CSS are in their respective folders (`job-tracker/`, `vana-timer/`, `ahpricer/`).
- Global styles are in `css/styles.css`.


---

Made by Meterman. For questions or feedback, see [github.com/meternx01](https://github.com/meternx01).
