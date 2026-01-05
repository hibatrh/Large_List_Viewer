# Large List Viewer - Optimized for 10M+ Users

A high-performance web application to display and navigate through very large user lists (up to 10 million) without freezing the browser.

![Application Screenshot](screenshot.png)

## Objective

This application solves the classic problem of displaying large amounts of data in a web browser. Instead of loading all items at once (which would freeze the browser), the application uses virtualization and progressive loading techniques to ensure optimal performance.

## Features

- **Virtual Scrolling** : Only displays visible elements on screen to optimize performance
- **Progressive Loading** : Loads data in chunks as you scroll
- **Alphabet Navigation** : A-Z menu to quickly navigate to a specific section
- **Real-time Counter** : Displays the number of loaded users / total
- **Responsive Interface** : Smooth scrolling at 60 FPS even with millions of elements

## Technologies Used

### Backend
- **Node.js** with Express.js
- File reading via streams to efficiently handle large files
- REST API with endpoints for pagination and alphabet index

### Frontend
- **React** with TypeScript
- Custom virtualization (without heavy external dependencies)
- Axios for API calls

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- A `users.txt` file containing the user list (one name per line, sorted alphabetically)

### Installation Steps

1. **Clone the repository**
```bash
git clone <repo-url>
cd App_list
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Place your users.txt file**
Place your file containing users in `backend/data/users.txt`

4. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

## Launch

### Starting the backend

In a terminal, from the `backend` folder:
```bash
npm start
```

The server starts on `http://localhost:3001`

### Starting the frontend

In another terminal, from the `frontend` folder:
```bash
npm start
```

The application opens automatically in the browser at `http://localhost:3000`

## Project Structure

```
App_list/
├── backend/
│   ├── data/
│   │   └── users.txt          # File containing users
│   ├── routes/
│   │   └── users.js           # API routes for users
│   ├── utils/
│   │   ├── fileReader.js      # File reading utilities
│   │   └── alphabetIndex.js   # Alphabet index generation
│   ├── server.js              # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── VirtualList.tsx    # Virtualized list component
│   │   │   └── AlphabetMenu.tsx   # A-Z navigation menu
│   │   ├── hooks/
│   │   │   └── useInfiniteScroll.ts  # Infinite scroll hook
│   │   ├── services/
│   │   │   └── api.ts          # API calls
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Usage

1. **Initial Display** : The first page of users loads automatically
2. **Infinite Scroll** : Scroll down to automatically load more users
3. **Letter Navigation** : Click on a letter in the A-Z menu to quickly navigate to that section
4. **Loading Tracking** : The counter at the top displays the number of loaded users out of the total


## Technical Optimizations

### Backend
- **Streaming** : Uses Node.js streams to read files line by line without loading everything into memory
- **Cache** : Caches the alphabet index and total count to avoid re-reading the file on every request
- **Efficient Pagination** : Precise offset calculation to directly access the correct position in the file

### Frontend
- **Virtualization** : Only visible elements (plus a few additional elements for buffer) are rendered in the DOM
- **Smart Accumulation** : Loaded data is accumulated and sorted to maintain order
- **Zone-based Loading** : When navigating by alphabet, multiple pages are loaded around the target position for a better experience
- **Memory Management** : Avoids keeping duplicates in memory through a loaded pages tracking system

## Known Issues / Limitations

- The users.txt file must be sorted alphabetically for alphabet navigation to work correctly
- For extremely large files (>10M lines), the first alphabet index generation may take a few seconds

## Possible Future Improvements

- Real-time name search
- Advanced filters
- Results export
- Custom sorting
- Cursor-based pagination instead of offset pagination


---
