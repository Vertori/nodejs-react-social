import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const AddContact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cookies] = useCookies(["access_token"]);

  const navigate = useNavigate();

  const addNewContact = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/contacts",
        { name, email, phone },
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      );
      navigate("/contacts");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="w-full max-w-xl px-4">
        <form className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Name"
            className="w-full input input-bordered"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <input
            type="text"
            placeholder="Email"
            className="w-full input input-bordered"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            type="text"
            placeholder="Phone"
            className="w-full input input-bordered"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
          />
          <button className="btn btn-primary" onClick={addNewContact}>
            Add new contact
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddContact;
