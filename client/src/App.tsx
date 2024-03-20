import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Contacts from "./pages/Contacts";
import AddContact from "./pages/AddContact";
import UpdateContact from "./pages/UpdateContact";
import Account from "./pages/Account";
import Recipes from "./pages/Recipes";
import UpdateRecipes from "./pages/UpdateRecipes";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/update/:id" element={<UpdateRecipes />} />
          <Route path="/contacts/add" element={<AddContact />} />
          <Route path="/contacts/update/:id" element={<UpdateContact />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
