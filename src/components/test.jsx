import { useEffect, useState } from "react";
import { getAllUsers } from "../utils/getProfiles"; // wherever you placed it

const Test = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getAllUsers();

      if (result.success) {
        setUsers(result.data);
      } else {
        setError(result.message);
      }

      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Users</h2>
      {users.map((user) => (
        <div key={user.id}>
          <p>
            {user.firstName} {user.lastName}
          </p>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default Test;
