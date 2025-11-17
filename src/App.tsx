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
import StampPage from './pages/Stamp/StampPage';
import { Event } from './pages/Stamp/Event';
import { StampEarning } from './pages/Stamp/StampEarning';
import StampHistory from './pages/Stamp/StampHistory';
import StampSetting from './pages/Stamp/StampSetting';
import { StampRegistration1 } from './pages/Stamp/StampRegistration1';
import { StampRegistration4 } from './pages/Stamp/StampRegistration4';
import { FindId } from './pages/SignUp/FindId';
import { FindPassword } from './pages/SignUp/FindPassword';
import { FindCustomerIdConfirm } from './pages/SignUp/FindCustomerIdConfirm';
import { KakaoCallback } from './KakaoCallback';
import { OwnerFail } from './pages/SignUp/OwnerFail';
import { ShopProfile } from './pages/Onboarding/ShopProfile';
import { FindOwnerIdConfirm } from './pages/SignUp/FindOwnerIdConfirm';
import { StoreInfo } from './pages/Store/StoreInfo';

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
          <Route path="/shop-profile" element={<ShopProfile />} />
          <Route path="/signup/customer" element={<CustomerSignup />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/myPage/setting" element={<Setting />} />
          <Route path="/myPage/profilesetting" element={<ProfileSetting />} />
          <Route path="/myPage/accountsetting" element={<AccountSetting />} />
          <Route path="/myPage/couponbox" element={<CouponBox />} />
          <Route path="/myPage/coupon" element={<Coupon />} />
          <Route path="/onboarding/customer" element={<CustomerOnboarding />} />
          <Route path="/map" element={<MapPage />} />
          <Route
            path="/signup/customer-confirm"
            element={<CustomerConfirm />}
          />
          <Route path="/reward" element={<Reward />} />
          <Route path="/stamp" element={<StampPage />} />
          <Route path="/stamp/event" element={<Event />} />
          <Route path="/stampearning" element={<StampEarning />} />
          <Route path="/stamphistory" element={<StampHistory />} />
          <Route path="/stampsetting" element={<StampSetting />} />
          <Route path="/stampregistration1" element={<StampRegistration1 />} />
          <Route path="/stampregistration4" element={<StampRegistration4 />} />
          <Route path="/find-id" element={<FindId />} />
          <Route path="/find-id-confirm" element={<FindIdConfirm />} />
          <Route path="/find-password" element={<FindPassword />} />
          <Route path='/map' element={<MapPage />} />
          <Route path='/signup/customer-confirm' element={<CustomerConfirm />} />
          <Route path='/reward' element={<Reward />} />
          <Route path='/stamp' element={<StampPage />} />
          <Route path='/find-id' element={<FindId />} />
          <Route path='/find-customer-id-confirm' element={<FindCustomerIdConfirm />} />
          <Route path='/find-owner-id-confirm' element={<FindOwnerIdConfirm />} />
          <Route path='/find-password' element={<FindPassword />} />
          <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />
          <Route path="/store/:storeNumber" element={<StoreInfo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
