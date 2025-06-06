import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import "@testing-library/jest-dom"; // Import jest-dom for toBeInTheDocument matcher
import App from "./App";

test("renders learn react link", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  const linkElement = screen.getByText(/Where/i);
  expect(linkElement).toBeInTheDocument();
});
