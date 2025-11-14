import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Navbar from '@/components/Navbar'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex justify-center items-center min-h-screen bg-neutral-800 font-sans">
        <div className="flex flex-col items-center w-[390px] h-[844px] bg-[#121212] text-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="flex-1 w-full  overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Outlet />
          </div>
          <Navbar />
        </div>
      </div>
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  ),
})
