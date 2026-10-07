import {BrowserRouter, Routes, Route} from "react-router-dom"
import {ThemeProvider} from "./context/ThemeContext"
import {DemoProvider} from "./context/DemoContext"
import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"
import ComingSoon from "./pages/ComingSoon"
function App() {
  return (
    <DemoProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </DemoProvider>
  )
}

export default App