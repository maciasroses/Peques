import { cn } from "@/app/shared/utils/cn";
import type { IAddress } from "@/app/shared/interfaces";

interface IAddressCard {
  address: IAddress;
}

const AddressCard = ({ address }: IAddressCard) => {
  return (
    <div className="relative shadow-lg border border-gray-200 rounded-lg p-4">
      <h3 className="font-bold text-lg line-clamp-1 pr-5">
        {address.fullName}
      </h3>
      <p>
        {address.address1}
        {address.address2 && ` - ${address.address2}`}
      </p>
      <p>
        {address.city}, {address.state}, {address.zipCode}
      </p>
      <div
        className={cn(
          address.isDefault && "flex flex-col lg:flex-row gap-2 justify-between"
        )}
      >
        <p>{address.phoneNumber}</p>
        {address.isDefault && (
          <p className="font-thin italic">Predeterminada</p>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
