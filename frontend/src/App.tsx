import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Container, Box } from "@mui/material";
import { Toaster } from "./components/ui/toaster";

// Pages
import CreateForm from "./pages/CreateForm";
import PreviewForm from "./pages/PreviewForm";
import MyForms from "./pages/MyForms";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
  typography: {
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
  },
});

const Home = () => {
  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log(response.data.message);
    } catch (e) {
      console.error(e, `errored out requesting / api`);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #EBF4FF 0%, #E0E7FF 50%, #F3E8FF 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', maxWidth: 'md', mx: 'auto' }}>
          <Box sx={{ mb: 8 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
                borderRadius: 4,
                mb: 3,
              }}
            >
              <svg width={40} height={40} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </Box>
            <Box
              component="h1"
              sx={{
                fontSize: '3rem',
                fontWeight: 700,
                color: 'text.primary',
                mb: 2,
              }}
            >
              Dynamic Form Builder
            </Box>
            <Box
              component="p"
              sx={{
                fontSize: '1.25rem',
                color: 'text.secondary',
                mb: 6,
                maxWidth: 'lg',
                mx: 'auto',
              }}
            >
              Create powerful, interactive forms with drag-and-drop simplicity. 
              Add validation, derived fields, and complex logic without writing code.
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center', alignItems: 'center', mb: 8 }}>
            <Box
              component="a"
              href="/create"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 4,
                py: 2,
                background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
                color: 'white',
                fontWeight: 600,
                borderRadius: 3,
                textDecoration: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #7b1fa2 90%)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Form
            </Box>
            <Box
              component="a"
              href="/myforms"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 4,
                py: 2,
                border: 2,
                borderColor: 'grey.300',
                color: 'text.primary',
                fontWeight: 600,
                borderRadius: 3,
                textDecoration: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'grey.400',
                  bgcolor: 'grey.50',
                },
              }}
            >
              <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              View My Forms
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { md: 'repeat(3, 1fr)' }, gap: 4, textAlign: 'left' }}>
            <Box sx={{ bgcolor: 'white', borderRadius: 3, p: 3, boxShadow: 1, border: 1, borderColor: 'grey.100' }}>
              <Box sx={{ width: 48, height: 48, bgcolor: 'primary.50', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <svg width={24} height={24} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#1976d2' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </Box>
              <Box component="h3" sx={{ fontSize: '1.125rem', fontWeight: 600, color: 'text.primary', mb: 1 }}>
                Drag & Drop Builder
              </Box>
              <Box component="p" sx={{ color: 'text.secondary' }}>
                Intuitive form creation with visual field editor and real-time preview
              </Box>
            </Box>

            <Box sx={{ bgcolor: 'white', borderRadius: 3, p: 3, boxShadow: 1, border: 1, borderColor: 'grey.100' }}>
              <Box sx={{ width: 48, height: 48, bgcolor: 'secondary.50', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <svg width={24} height={24} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#9c27b0' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </Box>
              <Box component="h3" sx={{ fontSize: '1.125rem', fontWeight: 600, color: 'text.primary', mb: 1 }}>
                Smart Validation
              </Box>
              <Box component="p" sx={{ color: 'text.secondary' }}>
                Built-in validation rules with custom error messages and real-time feedback
              </Box>
            </Box>

            <Box sx={{ bgcolor: 'white', borderRadius: 3, p: 3, boxShadow: 1, border: 1, borderColor: 'grey.100' }}>
              <Box sx={{ width: 48, height: 48, bgcolor: 'secondary.50', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <svg width={24} height={24} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#9c27b0' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </Box>
              <Box component="h3" sx={{ fontSize: '1.125rem', fontWeight: 600, color: 'text.primary', mb: 1 }}>
                Derived Fields
              </Box>
              <Box component="p" sx={{ color: 'text.secondary' }}>
                Create calculated fields that automatically update based on other form inputs
              </Box>
            </Box>
          </Box>

          <Box sx={{ mt: 8, pt: 4, borderTop: 1, borderColor: 'grey.200' }}>
            <Box component="p" sx={{ fontSize: '0.875rem', color: 'text.disabled' }}>
              Built with React, TypeScript, and Material-UI components
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateForm />} />
            <Route path="/preview" element={<PreviewForm />} />
            <Route path="/myforms" element={<MyForms />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App;
