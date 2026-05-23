import { Outlet } from 'react-router-dom';

import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar />

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}