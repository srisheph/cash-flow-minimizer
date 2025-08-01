# Cash Flow Minimizer

A web-based application that visualizes complex debts and calculates the minimum number of transactions required to settle them using a heap-based greedy algorithm.

**🚀 Live Demo Link:** [https://srisheph.github.io/cash-flow-minimizer/](https://srisheph.github.io/cash-flow-minimizer/)

<img width="1920" height="869" alt="Screenshot 2025-07-31 231850" src="https://github.com/user-attachments/assets/98f7af13-71a1-4890-8f5c-f055fba768ba" />

<img width="1920" height="867" alt="image" src="https://github.com/user-attachments/assets/55090a39-acfc-4036-b2ae-cbc5bd25567b" />



## Description

This project solves the "cash flow minimization" problem by taking a list of informal debts between a group of people and finding the most efficient settlement plan. The core logic is written in C++ for high performance and is compiled to WebAssembly to run directly in the browser. The front-end provides an interactive graph visualization of the debts before and after simplification.

## Features

- **Interactive Graph:** Debts are visualized as a dynamic, physics-based graph using Vis.js.
- **Real-time Updates:** Add transactions and see the debt graph build in real-time.
- **High-Performance C++ Logic:** The core algorithm is implemented in C++ and compiled to WebAssembly for near-native speed.
- **Clear Results:** Displays the simplified list of transactions needed to settle all debts, both visually and in a text list.

## Tech Stack

- **Backend Logic:** C++ (using Heaps/Priority Queues)
- **Compiler:** Emscripten (for WebAssembly)
- **Frontend:** HTML, CSS, JavaScript
- **Visualization Library:** Vis.js

## How to Run Locally

1.  Clone the repository.
2.  Navigate to the project directory.
3.  Run a simple local server (e.g., `python -m http.server`).
4.  Open `http://localhost:8000` in your browser.
