import LinkComp from "./LinkComp";

interface ISidebar {
  lng: string;
}

const Sidebar = ({ lng }: ISidebar) => {
  return (
    <aside className="fixed z-20 top-0 w-48 h-screen transition-transform -translate-x-full sm:translate-x-0">
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
          <li>
            <LinkComp icon="users" span="Usuarios" to={`/${lng}/admin/users`} />
          </li>
          <li>
            <LinkComp
              icon="products"
              span="Productos"
              to={`/${lng}/admin/products`}
            />
          </li>
          <li>
            <LinkComp
              icon="filters"
              span="Filtros"
              to={`/${lng}/admin/filters`}
            />
          </li>
          <li>
            <LinkComp icon="hero" span="Hero" to={`/${lng}/admin/hero`} />
          </li>
          <li>
            <LinkComp
              icon="collections"
              span="Colecciones"
              to={`/${lng}/admin/collections`}
            />
          </li>
          <li>
            <LinkComp
              icon="providers"
              span="Proveedores"
              to={`/${lng}/admin/providers`}
            />
          </li>
          <li>
            <LinkComp
              icon="promotions"
              span="Promociones"
              to={`/${lng}/admin/promotions`}
            />
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
