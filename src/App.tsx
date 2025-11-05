import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FirstPage } from './pages/FirstPage';
import { SignUp } from './pages/SignUp/SignUp';
import { OwnerSignup } from './pages/SignUp/OwnerSignUp';
import { CustomerSignup } from './pages/SignUp/CustomerSignUp';
import { CustomerOnboarding } from './pages/Onboarding/CustomerOnboarding';
import { Layout } from './Layout/LayOut';
import { MapPage } from './pages/MapPage';
import { OwnerSuccess } from './pages/SignUp/OwnerSuccess';
import { CustomerConfirm } from './pages/SignUp/CustomerConfirm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<FirstPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup/owner" element={<OwnerSignup />} />
          <Route path="/signup/owner-success" element={<OwnerSuccess />} />
          <Route path="/signup/customer" element={<CustomerSignup />} />
          <Route path="/onboarding/customer" element={<CustomerOnboarding />} />
          <Route path='/map' element={<MapPage />} />
          <Route path='/signup/customer-confirm' element={<CustomerConfirm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
