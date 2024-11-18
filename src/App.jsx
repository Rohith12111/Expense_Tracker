import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import ExpenseManagement from "./components/ExpenseManagement";
import UserManagement from "./components/UserManagement";
import { mockUsers, mockExpenses } from "./data/mockData";
import TotalCostByCategory from "./components/TotalCostByCategory";
import { AppProvider } from "./contexts/AppContext";

function AppLayout() {
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme") || "light"
  );
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  function changeTheme() {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }

  return (
    <div className="min-h-screen bg-base-200">
      <NavBar currentTheme={currentTheme} changeTheme={changeTheme} />
      <div className="container mx-auto px-4 py-8">
        <div className="tabs tabs-boxed justify-center mb-8">
          <button
            className={`tab tabs-lg ${
              activeTab === "users" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`tab tabs-lg ${
              activeTab === "expenses" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("expenses")}
          >
            Expenses
          </button>
          <button
            className={`tab tabs-lg ${
              activeTab === "summary" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("summary")}
          >
            Summary
          </button>
        </div>
      </div>
      <div>
        {activeTab === "users" && <UserManagement />}
        {activeTab === "expenses" && <ExpenseManagement />}
        {activeTab === "summary" && <TotalCostByCategory />}
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider initialUsers={mockUsers} initialExpenses={mockExpenses}>
      <AppLayout />
    </AppProvider>
  );
}

export default App;
