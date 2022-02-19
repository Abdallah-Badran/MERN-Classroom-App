import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './pages/signUp/signUp'
import Signin from './pages/signIn/signIn'
import Users from './pages/users/Users'
import Profile from './pages/profile/profile'
import EditProfile from './pages/editUser/editUser'
import Navbar from './components/navbar/navbar'
import NewCourse from './pages/newCourse/newCourse'
import PrivateElement from './components/privateElement/privateElement'
import MyCourses from './pages/myCourses/myCourses'
import Course from './pages/course/course'
import Enrollment from './pages/enrollment/enrollment'
import Home from './pages/home/home'
import EditCourse from './pages/editCourse/editCourse'

const App = () => {
    return (
        <BrowserRouter>
            <Navbar></Navbar>
            <Routes>
                <Route path="/signup" element={<Signup></Signup>}></Route>
                <Route path="/signin" element={<Signin></Signin>}></Route>
                <Route path="/users" element={<Users></Users>}></Route>
                <Route path="/user/edit/:userId" element={<EditProfile></EditProfile>}></Route>
                <Route path="/user/:userId" element={<Profile></Profile>}></Route>
                <Route element={<PrivateElement></PrivateElement>}>
                    <Route path="/teach/course/new" element={<NewCourse></NewCourse>}></Route>
                </Route>
                <Route path="/course/:courseId" element={<Course></Course>} />
                <Route path="/teach/courses" element={<MyCourses></MyCourses>}></Route>
                <Route path="/teach/course/:courseId" element={<Course></Course>}></Route>
                <Route path="/learn/:enrollmentId" element={<Enrollment></Enrollment>}></Route>
                <Route path="/" element={<Home></Home>}></Route>
                <Route path="/teach/course/edit/:courseId" element={<EditCourse></EditCourse>}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App