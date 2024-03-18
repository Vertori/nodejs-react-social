import { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import { useCookies } from "react-cookie";
import { UserContact } from "../types";
import { Link } from "react-router-dom";

const Contacts = () => {
  const [cookies] = useCookies(["access_token"]);
  const [userContacts, setUserContacts] = useState<UserContact[]>([]);
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext is not available");
  }

  const { user } = userContext;

  useEffect(() => {
    const fetchUsersContacts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/contacts", {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });
        console.log(response.data);
        setUserContacts(response.data);
      } catch (err) {}
    };
    fetchUsersContacts();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-12 py-4">
      <Link to="/addcontact" className="btn btn-wide">
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
              <th>Phone Color</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {userContacts.map((contact, index) => (
              <tr>
                <th>{index + 1}</th>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contacts;
