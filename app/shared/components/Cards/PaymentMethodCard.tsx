import { cn } from "@/app/shared/utils/cn";
import { IPaymentMethod } from "@/app/shared/interfaces";

interface IPaymentMethodCard {
  paymentMethod: IPaymentMethod;
}

const PaymentMethodCard = ({ paymentMethod }: IPaymentMethodCard) => {
  return (
    <div className="relative shadow-lg dark:shadow-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
      <p>
        {paymentMethod.brand} •••• {paymentMethod.last4Digits}
      </p>
      <div
        className={cn(
          paymentMethod.isDefault &&
            "flex flex-col lg:flex-row gap-2 justify-between"
        )}
      >
        <p>
          Vence el {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
        </p>
        {paymentMethod.isDefault && (
          <p className="font-thin italic">Predeterminada</p>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodCard;
