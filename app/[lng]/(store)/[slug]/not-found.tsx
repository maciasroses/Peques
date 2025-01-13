import { Card404 } from "@/app/shared/components";

const SearchNofFoundPage = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Card404
        title="No se encontró el producto"
        description="Intenta buscar otro producto"
      />
    </div>
  );
};

export default SearchNofFoundPage;
