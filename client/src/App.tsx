import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Contacts from "./pages/Contacts";
import AddContact from "./pages/AddContact";
import UpdateContact from "./pages/UpdateContact";
import Account from "./pages/Account";
import Recipes from "./pages/Recipes";
import UpdateRecipes from "./pages/UpdateRecipes";
import AddRecipe from "./pages/AddRecipe";
import axios from "axios";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import RecipeDetails from "./pages/RecipeDetails";

axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<Account />} />
          </Route>
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/add" element={<AddRecipe />} />
          <Route path="/recipes/update/:id" element={<UpdateRecipes />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/recipe/:id" element={<RecipeDetails />} />
          </Route>
          <Route path="/contacts/add" element={<AddContact />} />
          <Route path="/contacts/update/:id" element={<UpdateContact />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
