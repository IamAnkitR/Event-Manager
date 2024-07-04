// import React from "react";
// import { HomePage } from "./components/HomePage";

// const App: React.FC = () => {
//   return (
//     <div className="App">
//       <HomePage />
//     </div>
//   );
// };

// export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomePage } from "./components/HomePage";
import { EventDetail } from "./components/EventDetail";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/event/:eventId" element={<EventDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
