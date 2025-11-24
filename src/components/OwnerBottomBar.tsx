import { NavLink } from 'react-router-dom';
import dashBoardOn from '../assets/dashBoardOn.png';
import dashBoardOff from '../assets/dashBoardOff.png';
import manageOff from '../assets/manageOff.png';
import manageOn from '../assets/manageOn.png';
import eventOn from '../assets/eventOn.png';
import eventOff from '../assets/eventOff.png';
import settingOn from '../assets/settingOn.png';
import settingOff from '../assets/settingOff.png';

const navItems = [
    {
        id: 'dashboard',
        label: '대시보드',
        path: '/owner/dashboard',
        imgOn: dashBoardOn,
        imgOff: dashBoardOff,
    },
    {
        id: 'manage',
        label: '가게 관리',
        path: '/owner/manage',
        imgOn: manageOn,
        imgOff: manageOff,
    },
    {
        id: 'event',
        label: '이벤트',
        path: '/owner/eventmanage',
        imgOn: eventOn,
        imgOff: eventOff,
    },
    {
        id: 'settings',
        label: '설정',
        path: '/owner/settings',
        imgOn: settingOn,
        imgOff: settingOff,
    }
]

export const OwnerBottomBar = () => {
    return (
    <nav className="fixed bottom-3 left-0 right-0 z-50 mx-auto flex h-[72px] w-[360px] items-center justify-around bg-white shadow-[0_-1px_5px_rgba(0,0,0,0.08)] rounded-[20px]">
      {navItems.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          className="flex flex-1 items-center justify-center"
        >
          {({ isActive }) => {
            const imageSrc = isActive ? item.imgOn : (item.imgOff || item.imgOn);
            
            return (
                <img
                  src={imageSrc}
                  alt={item.label}
                  className="h-[62px] w-[62px] object-contain"
                />
            );
          }}
        </NavLink>
      ))}
    </nav>
  );
};