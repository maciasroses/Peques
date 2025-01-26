import { Card404 } from "@/app/shared/components";

const OrderIdNotFoundPage = () => {
  return (
    <div>
      <Card404
        title="Pedido no encontrado"
        description="El pedido que buscas no existe o ha sido eliminado."
      />
    </div>
  );
};

export default OrderIdNotFoundPage;
