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
import { CustomerConfirm } from './pages/Onboarding/CustomerConfirm';
import { Reward } from './pages/Reward/Reward';
import StampPage from './pages/Stamp/StampPage';
import { Event } from './pages/Stamp/Event';
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
import { ResetPassword } from './pages/SignUp/ResetPassword';
import { RewardInfo } from './pages/Reward/RewardInfo';
import { Dashboard } from './pages/Owner/Dashboard';
import { EventManage } from './pages/Owner/EventManage';
import { Manage } from './pages/Owner/Manage';
import { OwnerSettings } from './pages/Owner/OwnerSettings';
import { StampEarn } from './pages/Owner/StampEarn';
import { QRScan } from './pages/Owner/QRScan';
import { StampEarnWithId } from './pages/Owner/StampEarnWithId';
import { OwnerStampSetting } from './pages/Owner/OwnerStampSetting';
import { EventCreate } from './pages/Owner/EventCreate';
import { PastEvent } from './pages/Owner/PastEvent';
import { OwnerAccountInfo } from './pages/Owner/OwnerAccountInfo';
import { OwnerShopProfile } from './pages/Owner/OwnerShopProfile';
import Statistics from './pages/Owner/Statistics';
import { StoreReview } from './pages/Store/StoreReview';
import { StampEarnConfirmWithId } from './pages/Owner/StampEarnConfirmWithId';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/map" element={<MapPage />} />

        <Route element={<Layout />}>
          <Route path="/" element={<FirstPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup/owner" element={<OwnerSignup />} />
          <Route path="/signup/owner-success" element={<OwnerSuccess />} />
          <Route path="/signup/owner-fail" element={<OwnerFail />} />
          <Route path="/shop-profile" element={<ShopProfile />} />
          <Route path="/signup/customer" element={<CustomerSignup />} />
          {/* 마이페이지 관련 */}
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/myPage/setting" element={<Setting />} />
          <Route path="/myPage/profilesetting" element={<ProfileSetting />} />
          <Route path="/myPage/accountsetting" element={<AccountSetting />} />
          <Route path="/myPage/couponbox" element={<CouponBox />} />
          <Route path="/myPage/coupon" element={<Coupon />} />
          {/* 온보딩/인증 */}
          <Route path="/onboarding/customer" element={<CustomerOnboarding />} />
          <Route
            path="/signup/customer-confirm"
            element={<CustomerConfirm />}
          />
          {/* 리워드/스탬프 */}
          <Route path="/reward" element={<Reward />} />
          <Route path="/reward/info" element={<RewardInfo />} />
          <Route path="/stamp" element={<StampPage />} />
          <Route path="/event/:eventType" element={<Event />} />
          <Route path="/stamphistory" element={<StampHistory />} />
          <Route path="/stampsetting" element={<StampSetting />} />
          <Route path="/stampregistration1" element={<StampRegistration1 />} />
          <Route path="/stampregistration4" element={<StampRegistration4 />} />
          {/* 아이디/비번 찾기 */}
          <Route path="/find-id" element={<FindId />} />
          <Route
            path="/find-customer-id-confirm"
            element={<FindCustomerIdConfirm />}
          />
          <Route
            path="/find-owner-id-confirm"
            element={<FindOwnerIdConfirm />}
          />
          <Route path="/find-password" element={<FindPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* 소셜 로그인 콜백 */}
          <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />
          {/* 가게 상세/리뷰 */}
          <Route path="/store/:storeId" element={<StoreInfo />} />
          <Route path="/store/:storeId/review" element={<StoreReview />} />
          {/* 사장님 전용 페이지 */}
          <Route path="/owner/dashboard" element={<Dashboard />} />
          <Route path="/owner/manage" element={<Manage />} />
          <Route path="/owner/eventmanage" element={<EventManage />} />
          <Route path="/owner/settings" element={<OwnerSettings />} />
          <Route path="/owner/stamp-earn" element={<StampEarn />} />
          <Route path="/owner/stamp-earn/qr-scan" element={<QRScan />} />
          <Route
            path="/owner/stamp-earn/id-input"
            element={<StampEarnWithId />}
          />
          <Route
            path="/stamp-earn/confirm/:userId"
            element={<StampEarnConfirmWithId />}
          />
          <Route path="/owner/stampsetting" element={<OwnerStampSetting />} />
          <Route path="/owner/stamphistory" element={<StampHistory />} />
          <Route path="/owner/eventcreate" element={<EventCreate />} />
          <Route path="/owner/pastevent" element={<PastEvent />} />
          <Route path="/owner/accountinfo" element={<OwnerAccountInfo />} />
          <Route path="/owner/shopprofile" element={<OwnerShopProfile />} />
          <Route path="/owner/statistics" element={<Statistics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
