import { IPaymentMethod } from "../../interfaces";

interface IPaymentMethodCard {
  paymentMethod: IPaymentMethod;
}

const PaymentMethodCard = ({ paymentMethod }: IPaymentMethodCard) => {
  return (
    <div className="relative shadow-lg dark:shadow-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
      <p>
        {paymentMethod.brand} •••• {paymentMethod.last4Digits}
      </p>
      <p>
        Vence el {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
      </p>
    </div>
  );
};

export default PaymentMethodCard;
