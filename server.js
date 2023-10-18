const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const usersData = {
  "companyA": "Company A",
  "employees": [
    {
      "id": 5,
      "name": "John Doe",
      "position": "Software Engineer",
      "location": "New York"
    },
    {
      "id": 6,
      "name": "Jane Smith",
      "position": "Product Manager",
      "location": "San Francisco"
    },
    // Add more users as needed
  ]
};

// Get list of users
app.get('/getUsers', (req, res) => {
  const { employees } = usersData;
  res.json(employees);
});

// Insert a user
app.post('/postUsers', (req, res) => {
  const { name, position, location } = req.body;
  const id = usersData.employees.length + 1;

  const newUser = {
    id,
    name,
    position,
    location
  };

  usersData.employees.push(newUser);

  saveDataToFile(usersData);

  res.json(newUser);
});

// Get a single user by ID
app.get('/getUsers/:id', (req, res) => {
  const { id } = req.params;
  const user = usersData.employees.find((employee) => employee.id === Number(id));

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Delete a user by ID
app.delete('/deleteUsers/:id', (req, res) => {
  const { id } = req.params;
  const index = usersData.employees.findIndex((employee) => employee.id === Number(id));

  if (index !== -1) {
    usersData.employees.splice(index, 1);

    saveDataToFile(usersData);

    res.json({ message: 'User deleted successfully' });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

function saveDataToFile(data) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync('users.json', jsonData, 'utf8');
}

// Start the server
const port = 8080;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});