import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import MainLayout from "./pages/layout";
import UploadFilePage from "./pages/dashboard/dashboard";
import Documents from "./pages/documents/document";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<UploadFilePage />} />
          <Route path="/docs" element={<Documents />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
