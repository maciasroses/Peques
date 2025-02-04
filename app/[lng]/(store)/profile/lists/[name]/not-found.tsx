import { Card404 } from "@/app/shared/components";

const SearchNofFoundPage = () => {
  return (
    <div>
      <Card404
        title="Lista no encontrada"
        description="La lista que buscas no existe o no está disponible."
      />
    </div>
  );
};

export default SearchNofFoundPage;
