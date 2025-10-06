import React from 'react'
import Login from './Auth/Login'
import Signup from './Auth/Signup'
import { Route, Routes } from 'react-router-dom'
import Admin from './Dashboards/Admin'
import Customer from './Dashboards/Customer'
import Book from './Components/Book'
import UserList from './Components/UserList'
import Issue from './Components/Issue'
import Fine from './Components/Fine'
import IssueList from './Components/IssueList'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Signup />}></Route>
        <Route path='/login' element={<Login />}></Route>

        <Route path='/admin' element={<Admin />}></Route>
        <Route path='/customer' element={<Customer />}></Route>
        <Route path='/book' element={<Book/>}></Route>
        <Route path='/customerList' element={<UserList/>}></Route>
        <Route path='/issuebook' element={<Issue/>}></Route>
        <Route path='/fine' element={<Fine/>}></Route>
        <Route path='/issuelist' element={<IssueList/>}></Route>

      </Routes>


    </div>
  )
}





export default App

