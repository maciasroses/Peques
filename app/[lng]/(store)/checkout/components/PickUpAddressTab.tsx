import { cn } from "@/app/shared/utils/cn";
import { PICK_UP_ADDRESSES } from "@/app/shared/constants";
import type { IPickUpAddress } from "@/app/shared/interfaces";

interface IPickUpAddressComp {
  // pickUpAddresses: IPickUpAddress[]; // THIS WILL BE FUNCTIONALITY FOR FUTURE
  pickUpAddressSelected: IPickUpAddress | null;
  setPickUpAddress: (address: IPickUpAddress) => void;
}

const PickUpAddressTab = ({
  //   pickUpAddresses,
  pickUpAddressSelected,
  setPickUpAddress,
}: IPickUpAddressComp) => {
  if (pickUpAddressSelected) {
    PICK_UP_ADDRESSES.sort((a, b) => {
      if (a.id === pickUpAddressSelected.id) return -1;
      if (b.id === pickUpAddressSelected.id) return 1;
      return 0;
    });
  }

  return (
    <>
      <ul className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
        {PICK_UP_ADDRESSES.map((address) => (
          <li key={address.id}>
            <button
              className={cn(
                "w-full border-2 rounded-lg text-left",
                pickUpAddressSelected?.id === address.id
                  ? "border-primary bg-primary-light"
                  : "hover:bg-primary-light hover:border-primary border-gray-200"
              )}
              onClick={() => setPickUpAddress(address)}
            >
              <PickUpAddressCard address={address} />
            </button>
          </li>
        ))}
      </ul>
      {!pickUpAddressSelected && (
        <p className="text-center mt-4 font-bold text-lg">
          Selecciona una dirección de recogida para poder seleccionar el método
          de pago.
        </p>
      )}
    </>
  );
};

export default PickUpAddressTab;

const PickUpAddressCard = ({ address }: { address: IPickUpAddress }) => {
  return (
    <div className="shadow-lg border border-gray-200 rounded-lg p-4">
      <p>
        <strong>Dirección:</strong>
      </p>
      <p>{address.name}</p>
      <p>{address.street}</p>
      <p>
        {address.city}, {address.state}, {address.zipCode}
      </p>
      <p>{address.reference}</p>
      <br />
      <p>
        <strong>Horarios:</strong>
      </p>
      <ul>
        {address.schedule.map((schedule) => (
          <li key={schedule.id}>{schedule.value}</li>
        ))}
      </ul>
      <small className="mt-2">{address.notes}</small>
    </div>
  );
};
