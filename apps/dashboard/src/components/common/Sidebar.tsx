import { NavLink } from 'react-router-dom';

const navigationItems = [
  // {
  //   label: 'Dashboard',
  //   path: '/'
  // },
  {
    label: 'Emails',
    path: '/emails'
  },
  {
    label: 'Categories',
    path: '/categories'
  },
  // {
  //   label: 'Tone Rules',
  //   path: '/tone-rules'
  // },
  {
    label: 'Logs',
    path: '/logs'
  },
  // {
  //   label: 'Analytics',
  //   path: '/analytics'
  // }
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white">
          MAILPILOT
        </h1>
      </div>

      <nav className="p-4 flex flex-col gap-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `
              px-4
              py-3
              rounded-lg
              transition-all
              text-sm
              font-medium
              ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }
              `
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}