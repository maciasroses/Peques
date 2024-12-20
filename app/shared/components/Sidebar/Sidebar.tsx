import LinkComp from "./LinkComp";
import type { IUser } from "@/app/shared/interfaces";

interface ISidebar {
  user: IUser;
  lng: string;
}

const Sidebar = ({ user, lng }: ISidebar) => {
  console.log(lng);
  return (
    <aside className="fixed z-30 top-0 w-48 h-screen transition-transform -translate-x-full sm:translate-x-0">
      <div className="h-full px-4 pt-24 pb-4 overflow-y-auto bg-accent-light dark:bg-primary-dark text-primary-light">
        <ul className="space-y-2 font-medium">
          <li>
            <LinkComp icon="home" span="Inicio" to={`/${lng}/admin/home`} />
          </li>
          <li>
            <LinkComp icon="sales" span="Ventas" to={`/${lng}/admin/sales`} />
          </li>
          <li>
            <LinkComp
              icon="orders"
              span="Pedidos"
              to={`/${lng}/admin/orders`}
            />
          </li>
          <>
            <li>
              <LinkComp
                icon="products"
                span="Productos"
                to={`/${lng}/admin/products`}
              />
            </li>
            <li>
              <LinkComp
                icon="providers"
                span="Proveedores"
                to={`/${lng}/admin/providers`}
              />
            </li>
          </>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
