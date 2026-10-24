import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'
import Tooltip from './components/Tooltip'
import Home from './pages/Home'
import ProjectCaseStudy from './pages/ProjectCaseStudy'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectCaseStudy />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
      <ChatWidget />
      <Tooltip />
    </BrowserRouter>
  )
}
