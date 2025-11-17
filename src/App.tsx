import './App.css';
import { Layout } from './Layout/LayOut';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FirstPage } from './pages/FirstPage';
import { SignUp } from './pages/SignUp/SignUp';
import { OwnerSignup } from './pages/SignUp/OwnerSignUp';
import { CustomerSignup } from './pages/SignUp/CustomerSignUp';
import MyPage from './pages/MyPage/MyPage';
import Setting from './pages/MyPage/Setting';
import ProfileSetting from './pages/MyPage/ProfileSetting';
import AccountSetting from './pages/MyPage/AccountSetting';
import CouponBox from './pages/MyPage/CouponBox';
import Coupon from './pages/MyPage/Coupon';
import { CustomerOnboarding } from './pages/Onboarding/CustomerOnboarding';
import { MapPage } from './pages/MapPage';
import { OwnerSuccess } from './pages/SignUp/OwnerSuccess';
import { CustomerConfirm } from './pages/SignUp/CustomerConfirm';
import { Reward } from './pages/Reward';
import { StampPage } from './pages/Stamp/StampPage';
import { FindId } from './pages/SignUp/FindId';
import { FindPassword } from './pages/SignUp/FindPassword';
import { FindIdConfirm } from './pages/SignUp/FindIdConfirm';
import { KakaoCallback } from './KakaoCallback';
import { OwnerFail } from './pages/SignUp/OwnerFail';
import { ShopProfile } from './pages/Onboarding/ShopProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<FirstPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup/owner" element={<OwnerSignup />} />
          <Route path="/signup/owner-success" element={<OwnerSuccess />} />
          <Route path="/signup/owner-fail" element={<OwnerFail />} />
          <Route path='/shop-profile' element={<ShopProfile />} />
          <Route path="/signup/customer" element={<CustomerSignup />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/myPage/setting" element={<Setting />} />
          <Route path="/myPage/profilesetting" element={<ProfileSetting />} />
          <Route path="/myPage/accountsetting" element={<AccountSetting />} />
          <Route path="/myPage/couponbox" element={<CouponBox />} />
          <Route path="/myPage/coupon" element={<Coupon />} />
          <Route path="/onboarding/customer" element={<CustomerOnboarding />} />
          <Route path='/map' element={<MapPage />} />
          <Route path='/signup/customer-confirm' element={<CustomerConfirm />} />
          <Route path='/reward' element={<Reward />} />
          <Route path='/stamp' element={<StampPage />} />
          <Route path='/find-id' element={<FindId />} />
          <Route path='/find-id-confirm' element={<FindIdConfirm />} />
          <Route path='/find-password' element={<FindPassword />} />
          <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
