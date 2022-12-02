import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../../App/App";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "../redux/test-utils";

test("app page default", async () => {
  renderWithProviders(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
});

test("landing a login page", () => {
  const route = "/login";
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

  const h1 = screen.getByText(/Sign In !/i);
  expect(h1).toBeInTheDocument();
});

test("landing a forget-password page", () => {
  const route = "/forget-password";
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

  const h1 = screen.getByText(/Forget Password !/i);
  expect(h1).toBeInTheDocument();
});

test("landing a change-password page", () => {
  const route = "/change-password";
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

  const h1 = screen.getByText(/Change Password !/i);
  expect(h1).toBeInTheDocument();
});

test("landing a dashboard page", () => {
  const route = "/";
  renderWithProviders(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

  const h1 = screen.getByText(/Dashboard/i);
  expect(h1).toBeInTheDocument();
});
