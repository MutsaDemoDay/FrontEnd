import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FirstPage } from './pages/FirstPage';
import { SignUp } from './pages/SignUp/SignUp';
import { OwnerSignup } from './pages/SignUp/OwnerSignUp';
import { CustomerSignup } from './pages/SignUp/CustomerSignUp';
import MyPage from './pages/MyPage/MyPage';
import { Layout } from './Layout/LayOut';
import Setting from './pages/MyPage/Setting';
import ProfileSetting from './pages/MyPage/ProfileSetting';
import AccountSetting from './pages/MyPage/AccountSetting';
import CouponBox from './pages/MyPage/CouponBox';
import Coupon from './pages/MyPage/Coupon';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<FirstPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup/owner" element={<OwnerSignup />} />
          <Route path="/signup/customer" element={<CustomerSignup />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/myPage/setting" element={<Setting />} />
          <Route path="/myPage/profilesetting" element={<ProfileSetting />} />
          <Route path="/myPage/accountsetting" element={<AccountSetting />} />
          <Route path="/myPage/couponbox" element={<CouponBox />} />
          <Route path="/myPage/coupon" element={<Coupon />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
