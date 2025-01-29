import React, { useState, useContext, createContext } from 'react';
import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const users = [
  { account_id: 1, name: 'John Doe' },
  { account_id: 2, name: 'Jane Smith' },
  { account_id: 3, name: 'Sam Johnson' },
  { account_id: 4, name: 'Alice Brown' },
  { account_id: 5, name: 'Charlie White' }
];
const accounts = [
  { account_id: 1, balance: 1000 },
  { account_id: 2, balance: 500 },
  { account_id: 3, balance: 1500 },
  { account_id: 4, balance: 2000 },
  { account_id: 5, balance: 750 }
];
const calls = [
  { account_id: 1, call_duration: 120 },
  { account_id: 2, call_duration: 75 },
  { account_id: 3, call_duration: 90 },
  { account_id: 4, call_duration: 150 },
  { account_id: 5, call_duration: 60 }
];
const emails = [
  { account_id: 1, email_count: 20 },
  { account_id: 2, email_count: 15 },
  { account_id: 3, email_count: 25 },
  { account_id: 4, email_count: 30 },
  { account_id: 5, email_count: 10 }
];

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <AppContext.Provider value={{ selectedUser, setSelectedUser }}>
      {children}
    </AppContext.Provider>
  );
};

const UserSelector = () => {
  const { setSelectedUser } = useContext(AppContext);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="mb-4">
      <label className="form-label">Select User:</label>
      <select
        className="form-select"
        onChange={(e) => handleUserSelect(users.find(u => u.account_id === Number(e.target.value)))}
      >
        <option value="">-- Select a User --</option>
        {users.map((user) => (
          <option key={user.account_id} value={user.account_id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const UserTable = () => {
  const { selectedUser } = useContext(AppContext);
  const userAccount = selectedUser ? accounts.find(acc => acc.account_id === selectedUser.account_id) : null;
  const userCalls = selectedUser ? calls.filter(call => call.account_id === selectedUser.account_id) : [];
  const userEmails = selectedUser ? emails.filter(email => email.account_id === selectedUser.account_id) : [];

  if (!selectedUser) {
    return <p className="text-center text-muted">Please select a user to view the data.</p>;
  }

  return (
    <table className="table table-bordered mt-4">
      <thead>
        <tr>
          <th>User Name</th>
          <th>Account Balance</th>
          <th>Total Call Duration</th>
          <th>Total Email Count</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{selectedUser.name}</td>
          <td>${userAccount ? userAccount.balance : 'N/A'}</td>
          <td>{userCalls.reduce((sum, call) => sum + call.call_duration, 0)} minutes</td>
          <td>{userEmails.reduce((sum, email) => sum + email.email_count, 0)} emails</td>
        </tr>
      </tbody>
    </table>
  );
};

const Graph = () => {
  const { selectedUser } = useContext(AppContext);
  const userCalls = selectedUser ? calls.filter(call => call.account_id === selectedUser.account_id) : [];
  const userEmails = selectedUser ? emails.filter(email => email.account_id === selectedUser.account_id) : [];

  const data = {
    labels: ['Call Duration', 'Email Count'],
    datasets: [
      {
        label: selectedUser ? `${selectedUser.name}'s Data` : 'No User Selected',
        data: [
          userCalls.length > 0 ? userCalls.reduce((sum, call) => sum + call.call_duration, 0) : 0,
          userEmails.length > 0 ? userEmails.reduce((sum, email) => sum + email.email_count, 0) : 0
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  return (
    <div className="mt-5">
      {selectedUser ? (
        <Line data={data} />
      ) : (
        <p className="text-center text-muted">Please select a user to view the graph.</p>
      )}
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <div className="container mt-4">
        <h1 className="text-center mb-4">User Data Visualization</h1>
        <UserSelector />
        <UserTable />
        <Graph />
      </div>
    </AppProvider>
  );
};

export default App;
