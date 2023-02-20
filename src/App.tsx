import { useEffect, useState } from 'react'
import './App.css'

interface TPerson {
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  uniqueString?: string;
}

const formatPeople = ({results}:any) => {
  let people: TPerson[] = [];
  for(const result of results){
    let person: TPerson = {firstName: result.name.first, lastName:result.name.last, country: result.location.country, city: result.location.city}
    person.uniqueString = person.firstName+person.lastName+person.country+person.city
    person.uniqueString = person.uniqueString.toLowerCase()
    people.push(person)
  }

  return people
}

const sortBy = (key: Function, people: TPerson[]) => {

    let newPeople = people
    newPeople.sort((p1,p2) => {
      const p1t = key(p1).toLowerCase()
      const p2t = key(p2).toLowerCase()
      return (p1t < p2t) ? -1: (p1t> p2t) ? 1 : 0
    })

    return newPeople
}

function App() {
  const [people, setPeople] = useState<TPerson[]>([])
  const [search, setSearch] = useState<string>("")
  const [sort, setSort] = useState<string>("firstName")

  useEffect(() => {
    let newPeople: TPerson[]
    switch (sort) {
      case "firstName":
        newPeople = sortBy((person: TPerson) => person.firstName, [...people])
    setPeople(newPeople)
        break;
      case "lastName":
        newPeople = sortBy((person: TPerson) => person.lastName, [...people])
    setPeople(newPeople)
        break;
      case "country":
        newPeople = sortBy((person: TPerson) => person.country, [...people])
    setPeople(newPeople)
        break;
      case "city":
        newPeople = sortBy((person: TPerson) => person.city, [...people])
    setPeople(newPeople)
        break;
    
    }

  },[sort])

  useEffect(()=>{
    const fetchData = async () => {
      const data = await fetch("https://randomuser.me/api/?inc=location,name&results=100")
      const json = await data.json()

      return json
    }

    fetchData().then((res) => setPeople(formatPeople(res)))
  },[])

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredName = event.target.value;
    setSearch(enteredName.toLowerCase());
  }
  return(
    <>
    <select
     value={sort} 
      onChange={e => setSort(e.target.value)}
    >
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="country">Country</option>
          <option value="city">City</option>
    </select>
    <input onChange={inputHandler}></input>
     <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Country</th>
          <th>City</th>
      </tr>
      {people.map(person => {
        if (person.uniqueString?.includes(search)){

        return(
     <tr key={person.uniqueString}>
          <th key={person.firstName}>{person.firstName}</th>
          <th key={person.lastName}>{person.lastName}</th>
          <th key={person.country}>{person.country}</th>
          <th key={person.city}>{person.city}</th>
      </tr>)
        }
      })}
    </>
  )
}

export default App
