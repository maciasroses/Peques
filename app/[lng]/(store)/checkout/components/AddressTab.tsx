import { cn } from "@/app/shared/utils/cn";
import type { IAddress, IAddressState } from "@/app/shared/interfaces";
import AddressCard from "@/app/shared/components/Cards/AddressCard";
import { useState } from "react";
import { useModal } from "@/app/shared/hooks";
import { GenericInput, Modal, SubmitButton } from "@/app/shared/components";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { createNewAddress } from "@/app/shared/services/address/controller";

interface IAddressTab {
  addresses: IAddress[];
  addressSelected: IAddress | null;
  setAddress: (address: IAddress) => void;
}

const AddressTab = ({
  addresses,
  setAddress,
  addressSelected,
}: IAddressTab) => {
  return (
    <>
      {addresses.length > 0 && (
        <>
          <h1 className="text-xl mb-4">Mis direcciones</h1>
          <ul className="flex flex-col gap-2">
            {addresses.map((address) => (
              <li key={address.id}>
                <button
                  className={cn(
                    "w-full border rounded-lg",
                    addressSelected?.id === address.id
                      ? "border-blue-500"
                      : "border-gray-200"
                  )}
                  onClick={() => setAddress(address)}
                >
                  <AddressCard address={address} />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <AddressForm />
    </>
  );
};

export default AddressTab;

const AddressForm = () => {
  const { isOpen, onClose, onOpen } = useModal();
  const [isPending, setIsPending] = useState(false);
  const [badResponse, setBadResponse] = useState<IAddressState>(
    INITIAL_STATE_RESPONSE
  );

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await createNewAddress(formData);
    if (res && !res.success) {
      setBadResponse(res);
    } else {
      onClose();
    }
    setIsPending(false);
  };

  return (
    <>
      <button onClick={onOpen}>Agregar dirección</button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <h1 className="text-xl md:text-4xl">Crear nueva dirección</h1>
        {badResponse.message && (
          <p className="text-center text-red-500">{badResponse.message}</p>
        )}
        <form onSubmit={submitAction}>
          <fieldset
            disabled={isPending}
            className={cn(isPending && "opacity-50")}
          >
            <div className="flex flex-col gap-2">
              <GenericInput
                id="fullName"
                ariaLabel="Full name"
                type="text"
                placeholder="John Doe Doe"
                error={badResponse.errors?.fullName}
                autoComplete="off"
              />
              <GenericInput
                id="address1"
                ariaLabel="Address 1"
                type="text"
                placeholder="1234 Main St"
                error={badResponse.errors?.address1}
                autoComplete="off"
              />
              <GenericInput
                id="address2"
                ariaLabel="Address 2"
                type="text"
                placeholder="Apartment, studio, or floor"
                error={badResponse.errors?.address2}
                autoComplete="off"
              />
              <GenericInput
                id="city"
                ariaLabel="City"
                type="text"
                placeholder="City"
                error={badResponse.errors?.city}
                autoComplete="off"
              />
              <GenericInput
                id="state"
                ariaLabel="State"
                type="text"
                placeholder="State"
                error={badResponse.errors?.state}
                autoComplete="off"
              />
              <GenericInput
                id="zipCode"
                ariaLabel="Zip code"
                type="text"
                placeholder="Zip code"
                error={badResponse.errors?.zipCode}
                autoComplete="off"
              />
              <GenericInput
                id="country"
                ariaLabel="Country"
                type="text"
                placeholder="Country"
                error={badResponse.errors?.country}
                autoComplete="off"
              />
              <GenericInput
                id="phoneNumber"
                ariaLabel="Phone number"
                type="text"
                placeholder="Phone number"
                error={badResponse.errors?.phoneNumber}
                autoComplete="off"
              />
              <GenericInput
                id="additionalInfo"
                ariaLabel="Additional info"
                type="textarea"
                placeholder="Additional info"
                error={badResponse.errors?.additionalInfo}
                autoComplete="off"
              />
              <div className="flex gap-2">
                <GenericInput
                  id="isDefault"
                  ariaLabel="Mark as default address"
                  type="checkbox"
                />
              </div>
            </div>
            <div className="text-center mt-4 w-full">
              <SubmitButton
                color="primary"
                pending={isPending}
                title="Agregar dirección"
              />
            </div>
          </fieldset>
        </form>
      </Modal>
    </>
  );
};
