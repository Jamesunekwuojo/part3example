import { useState, useEffect } from "react";
import personService from "./services/person";


// Filter component for search input
const Filter = ({ searchTerm, handleFilter }) => {
  return (
    <>
      <div>
        filter shown with{" "}
        <input type="text" value={searchTerm} onChange={handleFilter} />
      </div>
    </>
  );
};

// Component to render all filtered persons
const Person = ({ filteredPersons, handleDelete }) => {
  return (
    <>
      <div>
        {filteredPersons.map((person) => (
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() => handleDelete(person.id)}>delete</button>
          </li>
        ))}
      </div>
    </>
  );
};

// Form component for adding a new person
const PersonForm = ({
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
  handleAddperson,
}) => {
  return (
    <>
      <form onSubmit={handleAddperson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>

        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>

        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

// notification

const Notification = ({ message }) => {
  console.log(message)
  


  if (message === null) {
    return null;
  }

  // Conditionally apply success or error class
  
  const isSuccess = message.startsWith('Added') || message.startsWith('updated');

  return (
    <div className={isSuccess ? "success" : "error"}>
      {message}
    </div>
  );
};


// main app component
const App = () => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // to hold or store the current value of the items being searched
  const [errorMessage, setErrorMessage]=useState(null)

  const [persons, setPersons] = useState([


  ]);

 


  // Handle name input change
  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  // Handle number input change
  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  // Handle search filter change
  const handleFilter = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter persons based on the search term
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // handle update function
  const handleupdatedPerson = (id, updatedPerson) => {

    personService
    .updatePerson(id, updatedPerson)
    .then(returnedPerson => {
      setPersons(persons.map(person => (person.id !== id? person: returnedPerson)))

      setNewName('');
      setNewNumber('');
      setErrorMessage(`updated ${updatedPerson.name} number successfully`)

      setTimeout(()=>{
        setErrorMessage(null)
      }, 5000);



    

    })
    .catch(error=> {

      if(error.response && error.response.status === 404) {
        setErrorMessage(`${updatedPerson.name} has already been deleted`)
        setPersons(persons.filter((p) => p.id !== id));

      } else {
        setErrorMessage(`Error updated ${updatedPerson.name}`)
      }
    
   
    })
  }


  const handleAddperson = (e) => {
    e.preventDefault();

    const personExists = persons.find(person => person.name ===newName);


    if(personExists){
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = {...personExists, number:newNumber} 

        handleupdatedPerson(personExists.id, updatedPerson);
        // setErrorMessage(`updated ${personExists.name} number successfully `)

        setTimeout(() =>{
          setErrorMessage(null)

        }, 5000)
      }
       
    } else {

      const newPerson = {
        name: newName,
        number: newNumber,
        // id: persons.length + 1, // to Ensure each person gets a unique id
      };

      personService
      .createPerson(newPerson)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setErrorMessage(`Added ${newPerson.name}`);

        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }).catch((error) => {
        alert(`${newPerson.name}is already added to the phonebook`)
        console.log(error)
      })


    

      


      
  
      // if (persons.some((person) => person.name === newName)) {
      //   alert(`${newName} is already added to the phonebook`);
      // } else {
       
      //   setPersons(persons.concat(newPerson));
      //   setNewName(""); // to  Reset name input field
      //   setNewNumber(""); // to Reset number input field
      //   setErrorMessage(`Added ${newName}`)

      //   setTimeout(() => {
      //     setErrorMessage(null)
          
      //   }, 5000);
      // }
      
    }

   
  };

  // useffect hook for fetching data fro server

  useEffect(() => {
    personService.getPersons().then((initalPersons) => {
      console.log(initalPersons);
      setPersons(initalPersons);
    });
  }, []);

  const handleDelete = (id) => {
    const person = persons.find(p => p.id ===id)
 
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter((p) => p.id !==id));

      })
      .catch((error) => {

        setPersons(persons.filter((p) => p.id !== id));
        alert("Error deleting")
       

        // setTimeout(() => {

        //   setErrorMessage(null)

        // }, 5000)

      })
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {/* Notification */}
      <Notification  message={errorMessage}/>

      {/* Search field */}
      <Filter searchTerm={searchTerm} handleFilter={handleFilter} />

      <h2>add a new</h2>

      {/* Form to add a new person */}
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleAddperson={handleAddperson}
      />

      <h2>Numbers</h2>

      {/* Render filtered persons */}
      <Person filteredPersons={filteredPersons} handleDelete={handleDelete}/>
    </div>
  );
};

export default App;
