import { Card404 } from "@/app/shared/components";

const CollectionNamePageNotFound = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Card404
        title="No se encontró la colección"
        description="Intenta buscar otra colección"
      />
    </div>
  );
};

export default CollectionNamePageNotFound;
