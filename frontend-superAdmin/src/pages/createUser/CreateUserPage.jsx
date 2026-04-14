import { useState } from "react";
import CreateUser from "./CreateUser";
import UsersList from "./UsersList";

export default function CreateUserPage() {
  const [view, setView] = useState("list");

  return (
    <div className="min-h-screen">
      {view === "list" ? (
        <UsersList onGoCreate={() => setView("create")} />
      ) : (
        <CreateUser onGoBack={() => setView("list")} />
      )}
    </div>
  );
}