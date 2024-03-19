import axios from "axios";
import { useCookies } from "react-cookie";
import { UserContact } from "../types";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Contacts = () => {
  const [cookies] = useCookies(["access_token"]);
  const queryClient = useQueryClient();

  const {
    data: userContactsData,
    isLoading: UserContactsLoading,
    isError: UserContactsError,
  } = useQuery({
    queryKey: ["userContacts"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:5000/api/contacts", {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      });
      return data as UserContact[];
    },
  });

  const deleteUsersContact = useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await axios.delete(
        `http://localhost:5000/api/contacts/${userId}`,
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
    },
  });

  if (UserContactsLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (UserContactsError) {
    return (
      <div className="flex items-center justify-center w-screen h-screen px-2">
        <div role="alert" className="max-w-lg alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 stroke-current shrink-0"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Something went wrong! Couldn't get your contacts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-12 py-4 mt-32">
      <Link to="/contacts/add" className="btn btn-wide">
        Add new contact
      </Link>
      <div className="w-full overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {userContactsData?.map((contact, index) => (
              <tr key={contact.email}>
                <th>{index + 1}</th>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td className="flex gap-4">
                  <Link to={`/contacts/update/${contact._id}`}>
                    <button className="btn btn-info">Update</button>
                  </Link>
                  <button
                    onClick={() => deleteUsersContact.mutate(contact._id)}
                    className="btn btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contacts;
