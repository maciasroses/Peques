import { cn } from "@/app/shared/utils/cn";
import type { IAddress, IAddressState } from "@/app/shared/interfaces";
import AddressCard from "@/app/shared/components/Cards/AddressCard";
import { ReactNode, useState } from "react";
import { useModal } from "@/app/shared/hooks";
import { GenericInput, Modal, SubmitButton } from "@/app/shared/components";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { createNewAddress } from "@/app/shared/services/address/controller";
import { PlusCircle } from "@/app/shared/icons";

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
  if (!addressSelected) {
    // ORDER BY DEFAULT ADDRESS
    addresses.sort((a, b) => {
      if (a.isDefault) return -1;
      if (b.isDefault) return 1;
      return 0;
    });
  } else {
    // ORDER BY SELECTED ADDRESS
    addresses.sort((a, b) => {
      if (a.id === addressSelected.id) return -1;
      if (b.id === addressSelected.id) return 1;
      return 0;
    });
  }

  return (
    <>
      {addresses.length > 0 ? (
        <>
          <p className="text-lg mb-4">Mis direcciones</p>
          <ul className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
            {addresses.map((address) => (
              <li key={address.id}>
                <button
                  className={cn(
                    "w-full border-2 rounded-lg text-left",
                    addressSelected?.id === address.id
                      ? "border-primary bg-primary-light"
                      : "hover:bg-primary-light hover:border-primary border-gray-200"
                  )}
                  onClick={() => setAddress(address)}
                >
                  <AddressCard address={address} />
                </button>
              </li>
            ))}
          </ul>
          {!addressSelected && (
            <p className="text-center mt-4 font-bold text-lg">
              Selecciona una dirección para poder seleccionar el método de pago.
            </p>
          )}
        </>
      ) : (
        <p className="text-center">
          Agrega una dirección para poder seleccionarla como dirección de envío
          y seleccionar el método de pago.
        </p>
      )}
      <AddressForm setAddress={setAddress} />
    </>
  );
};

export default AddressTab;

interface IAddressForm {
  setAddress: (address: IAddress) => void;
}

const AddressForm = ({ setAddress }: IAddressForm) => {
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
    const res = await createNewAddress({ formData, isForCheckout: true });
    if (res && !res.success) {
      setBadResponse(res);
    } else {
      setAddress(res.address as IAddress);
      onClose();
    }
    setIsPending(false);
  };

  return (
    <>
      <div className="mt-4 w-full text-center">
        <button
          onClick={onOpen}
          // className="inline-flex gap-2 items-center justify-center link-button-primary"
          className="bg-accent hover:bg-accent-dark focus:ring-accent py-2 px-4 rounded-lg inline-flex gap-2 items-center justify-center"
        >
          Agregar dirección
          <span>
            <PlusCircle />
          </span>
        </button>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <h1 className="text-xl md:text-4xl text-center mb-4">
          Crear nueva dirección
        </h1>
        {badResponse.message && (
          <p className="text-center text-red-500">{badResponse.message}</p>
        )}
        <form onSubmit={submitAction}>
          <fieldset
            disabled={isPending}
            className={cn(isPending && "opacity-50")}
          >
            <div className="flex flex-col gap-2">
              <GenericPairDiv>
                <GenericDiv>
                  <GenericInput
                    id="address1"
                    ariaLabel="Dirección"
                    type="text"
                    placeholder="Calle, número exterior"
                    error={badResponse.errors?.address1}
                    autoComplete="off"
                  />
                </GenericDiv>
                <GenericDiv>
                  <GenericInput
                    id="address2"
                    ariaLabel="Dirección 2"
                    type="text"
                    placeholder="Colonia, número interior"
                    error={badResponse.errors?.address2}
                    autoComplete="off"
                  />
                </GenericDiv>
              </GenericPairDiv>
              <GenericPairDiv>
                <GenericDiv>
                  <GenericInput
                    id="state"
                    ariaLabel="Estado"
                    type="text"
                    placeholder="Chihuahua"
                    error={badResponse.errors?.state}
                    autoComplete="off"
                  />
                </GenericDiv>
                <GenericDiv>
                  <GenericInput
                    id="city"
                    ariaLabel="Ciudad"
                    type="text"
                    placeholder="Chihuahua"
                    error={badResponse.errors?.city}
                    autoComplete="off"
                  />
                </GenericDiv>
                <GenericDiv>
                  <GenericInput
                    id="zipCode"
                    ariaLabel="Código postal"
                    type="number"
                    placeholder="31000"
                    min="00000"
                    max="99999"
                    error={badResponse.errors?.zipCode}
                    autoComplete="off"
                  />
                </GenericDiv>
              </GenericPairDiv>
              {/* <GenericInput
                id="country"
                ariaLabel="Country"
                type="text"
                placeholder="Country"
                error={badResponse.errors?.country}
                autoComplete="off"
              /> */}
              <GenericInput
                id="additionalInfo"
                ariaLabel="Información adicional"
                type="textarea"
                placeholder="Referencias"
                error={badResponse.errors?.additionalInfo}
                autoComplete="off"
              />
              <GenericInput
                id="fullName"
                ariaLabel="Nombre completo"
                type="text"
                placeholder="Juan Pérez"
                error={badResponse.errors?.fullName}
                autoComplete="off"
              />
              <GenericInput
                id="phoneNumber"
                ariaLabel="Número de teléfono"
                type="text"
                placeholder="6141234567"
                error={badResponse.errors?.phoneNumber}
                autoComplete="off"
              />
              <div className="flex gap-2 justify-end">
                <GenericInput
                  id="isDefault"
                  ariaLabel="Marcar como dirección predeterminada"
                  type="checkbox"
                />
              </div>
            </div>
            <div className="text-center mt-4 w-full">
              <SubmitButton
                color="accent"
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

const GenericDiv = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col gap-2 w-full lg:w-1/2">{children}</div>;
};

const GenericPairDiv = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-2 w-full">{children}</div>
  );
};
