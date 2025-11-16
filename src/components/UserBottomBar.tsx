import { NavLink } from 'react-router-dom';
import stampOn from '../assets/StampOn.png';
import stampOff from '../assets/StampOff.png';
import mapOn from '../assets/MapOn.png';
import mapOff from '../assets/MapOff.png';
import rewardOn from '../assets/RewardOn.png';
import rewardOff from '../assets/RewardOff.png';
import mypageOn from '../assets/MyPageOn.png';
import mypageOff from '../assets/MyPageOff.png';

const navItems = [
    {
        id: 'stamp',
        label: '스탬프',
        path: '/stamp',
        imgOn: stampOn,
        imgOff: stampOff,
    },
    {
        id: 'map',
        label: '지도',
        path: '/map',
        imgOn: mapOn,
        imgOff: mapOff,
    },
    {
        id: 'reward',
        label: '리워드',
        path: '/reward',
        imgOn: rewardOn,
        imgOff: rewardOff,
    },
    {
        id: 'mypage',
        label: '마이페이지',
        path: '/mypage',
        imgOn: mypageOn,
        imgOff: mypageOff,
    }
]

export const UserBottomBar = () => {
    return (
    <nav className="fixed bottom-5 left-0 right-0 z-50 mx-auto flex h-[72px] w-[360px] items-center justify-around bg-white shadow-[0_-1px_5px_rgba(0,0,0,0.08)] rounded-[20px]">
      {navItems.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          className="flex flex-1 items-center justify-center"
        >
          {({ isActive }) => (
            <img
              src={isActive ? item.imgOn : item.imgOff}
              alt={item.label}
              className="h-[62px] w-[62px] object-contain"
            />
          )}
        </NavLink>
      ))}
    </nav>
  );
};