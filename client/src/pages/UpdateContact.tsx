import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { UserContact } from "../types";

const UpdateContact = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cookies] = useCookies(["access_token"]);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: contactToUpdateData,
    isLoading: contactToUpdateLoading,
    isError: contactToUpdateError,
  } = useQuery({
    queryKey: ["contactToUpdate"],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/api/contacts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      );
      setName(data.name);
      setEmail(data.email);
      setPhone(data.phone);
      return data as UserContact;
    },
  });

  const updateContact = useMutation({
    mutationFn: async () => {
      const { data } = await axios.put(
        `http://localhost:5000/api/contacts/${contactToUpdateData?._id}`,
        { name, email, phone },
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      );
      return data as UserContact;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userContacts"] });
      navigate("/contacts");
    },
  });

  const handleUpdateContactMutation = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    updateContact.mutate();
  };

  if (contactToUpdateLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

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
          <button
            className="text-white btn btn-primary"
            onClick={handleUpdateContactMutation}
          >
            Update contact
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateContact;
