import { fireEvent, render, screen } from "@testing-library/react";
import App from "../../App/App";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";


test("login page should be render", async () => {
  const login = "/login";
  render(
    <MemoryRouter initialEntries={[login]}>
      <App />
    </MemoryRouter>
  );
  const h1 = screen.getByText(/Sign In !/i);
  expect(h1).toBeInTheDocument();

  // if click to forget-password page
  await userEvent.click(screen.getByText(/Forget Password?/i));
  expect(screen.getByText(/Forget Password !/i)).toBeInTheDocument();
});

test("password && email input should be render", () => {
  const login = "/login";
  render(
    <MemoryRouter initialEntries={[login]}>
      <App />
    </MemoryRouter>
  );

  const inputEmail = screen.getByPlaceholderText(/Enter email/i);
  expect(inputEmail).toBeInTheDocument();

  const inputPassword = screen.getByPlaceholderText(/Enter password/i);
  expect(inputPassword).toBeInTheDocument();
});

test("button input should be render", () => {
  const login = "/login";
  render(
    <MemoryRouter initialEntries={[login]}>
      <App />
    </MemoryRouter>
  );
  const inputButton = screen.getByRole("button");
  fireEvent.click(inputButton);
  expect(inputButton).toBeInTheDocument();
});

test("handleLogin axios", async () => {
  const login = "/login";
  render(
    <MemoryRouter initialEntries={[login]}>
      <App />
    </MemoryRouter>
  );
  const inputEmail = screen.getByPlaceholderText(/Enter email/i);
  const inputPassword = screen.getByPlaceholderText(/Enter password/i);
  const inputButton = screen.getByRole("button");

  fireEvent.change(inputEmail, {
    target: { value: "salemlokmani99@gmail.com" },
  });

  fireEvent.change(inputPassword, {
    target: { value: "Salem-12" },
  });
  fireEvent.click(inputButton);
});
