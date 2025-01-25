"use server";

import { ICollection, IProduct } from "../../interfaces";
import { isAdmin } from "../auth";
import { getCollectionByName } from "../collection/controller";
import { getProductByKey } from "../product/controller";
import {
  create,
  createProductFilter,
  read,
  remove,
  removeProductFilter,
  update,
  updateProductFilter,
} from "./model";
import { validateSchema } from "./schema";

interface IGetFilters {
  q?: string;
}

export async function getFilters({ q }: IGetFilters) {
  try {
    return await read({
      q,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error getting filters");
  }
}

export async function createFilter(formData: FormData) {
  const dataToValidate = {
    name: formData.get("name"),
    key: formData.get("key"),
  };

  const errors = validateSchema("create", dataToValidate);

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Error en la validación de los datos",
      errors,
    };
  }

  const someDataEmpty = Array.from(formData.entries()).some(
    ([, value]) => !value
  );

  if (someDataEmpty) {
    return { success: false, message: "Faltan datos" };
  }

  const structuredData = Array.from(formData.entries())
    .map(([name, value]) => ({
      name,
      value: value.toString(),
    }))
    .reduce<{
      name: string;
      key: string;
      filters: {
        name: string;
        key: string;
        products: string[];
      }[];
      collections: { key: string }[];
    }>(
      (acc, field) => {
        const { name, value } = field;

        if (name === "name" || name === "key") {
          acc[name] = value; // Datos del FilterGroup
        } else if (name === "filterName") {
          acc.filters.push({ name: value, key: "", products: [] });
        } else if (name === "filterKey") {
          acc.filters[acc.filters.length - 1].key = value;
        } else if (name.startsWith("product-")) {
          const index = parseInt(name.split("-")[1], 10);
          acc.filters[index]?.products.push(value);
        } else if (name === "collectionKey") {
          acc.collections.push({ key: value });
        }

        return acc;
      },
      { name: "", key: "", filters: [], collections: [] }
    );

  try {
    await isAdmin();

    // Obtener IDs de las colecciones por sus claves
    const collectionsIds = await Promise.all(
      structuredData.collections.map(async (collection) => {
        if (!collection.key) {
          throw new Error(`Falta la clave de la colección`);
        }
        const data = (await getCollectionByName({
          name: collection.key,
        })) as ICollection;
        if (!data) {
          throw new Error(
            `Colección con clave "${collection.key}" no encontrada.`
          );
        }
        return data.id;
      })
    );

    // Obtener IDs de los productos
    for (const filter of structuredData.filters) {
      const productIds = await Promise.all(
        filter.products.map(async (productKey: string) => {
          if (!productKey) {
            throw new Error(`Falta la clave del producto`);
          }
          const product = (await getProductByKey({
            key: productKey,
          })) as IProduct;
          if (!product) {
            throw new Error(`Producto con clave "${productKey}" no encontrado`);
          }
          return product.id;
        })
      );
      filter.products = productIds;
    }

    // Crear el FilterGroup con sus filtros y productos
    await create({
      data: {
        name: structuredData.name,
        key: structuredData.key,
        collections: {
          create: collectionsIds.map((id: string) => ({ collectionId: id })),
        },
        filters: {
          create: structuredData.filters.map((filter: any) => ({
            name: filter.name,
            key: filter.key,
            products: {
              create: filter.products.map((id: string) => ({ productId: id })),
            },
          })),
        },
      },
    });
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error interno al crear el filtro" };
  }
}

export async function updateFilter(filterId: string, formData: FormData) {
  const dataToValidate = {
    name: formData.get("name"),
    key: formData.get("key"),
  };

  const errors = validateSchema("update", dataToValidate);

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Error en la validación de los datos",
      errors,
    };
  }

  try {
    await isAdmin();

    const filter = await read({ id: filterId });

    if (!filter) {
      throw new Error("Filter not found");
    }

    await update({
      id: filterId,
      data: {
        name: formData.get("name") as string,
        key: formData.get("key") as string,
      },
    });
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error interno al actualizar el filtro" };
  }
}

export async function deleteFilter(filterId: string) {
  try {
    await isAdmin();

    const filter = await read({ id: filterId });

    if (!filter) {
      throw new Error("Filter not found");
    }

    await remove({ id: filterId });
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error interno al eliminar el filtro" };
  }
}

export async function deleteMassiveFilter(filterIds: string[]) {
  try {
    await isAdmin();

    await Promise.all(filterIds.map(async (id) => remove({ id })));
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error interno al eliminar los filtros seleccionados",
    };
  }
}

export async function addToFilterGroup(
  formData: FormData,
  filterGroupId: string,
  filterGroupType: string
) {
  if (
    !filterGroupId ||
    !filterGroupType ||
    (filterGroupType !== "collection" && filterGroupType !== "product")
    // Array.from(formData.entries()).some(([, value]) => !value)
  ) {
    throw new Error("Missing or invalid data");
  }

  const someDataEmpty = Array.from(formData.entries()).some(
    ([, value]) => !value
  );

  if (someDataEmpty) {
    return { success: false, message: "Faltan datos" };
  }

  const structuredData = Array.from(formData.entries())
    .map(([name, value]) => ({
      name,
      value: value.toString(),
    }))
    .reduce<{
      filters: {
        name: string;
        key: string;
        products: string[];
      }[];
      collections: { key: string }[];
    }>(
      (acc, field) => {
        const { name, value } = field;

        if (name === "filterName") {
          acc.filters.push({ name: value, key: "", products: [] });
        } else if (name === "filterKey") {
          acc.filters[acc.filters.length - 1].key = value;
        } else if (name.startsWith("product-")) {
          const index = parseInt(name.split("-")[1], 10);
          acc.filters[index]?.products.push(value);
        } else if (name === "collectionKey") {
          acc.collections.push({ key: value });
        }

        return acc;
      },
      { filters: [], collections: [] }
    );

  try {
    await isAdmin();

    if (filterGroupType === "collection") {
      // Obtener IDs de las colecciones por sus claves
      const collectionsIds = await Promise.all(
        structuredData.collections.map(async (collection) => {
          if (!collection.key) {
            throw new Error(`Falta la clave de la colección`);
          }
          const data = (await getCollectionByName({
            name: collection.key,
          })) as ICollection;
          if (!data) {
            throw new Error(
              `Colección con clave "${collection.key}" no encontrada.`
            );
          }
          return data.id;
        })
      );

      await update({
        id: filterGroupId,
        data: {
          collections: {
            create: collectionsIds.map((id: string) => ({ collectionId: id })),
          },
        },
      });
    } else {
      // Obtener IDs de los productos
      for (const filter of structuredData.filters) {
        const productIds = await Promise.all(
          filter.products.map(async (productKey: string) => {
            if (!productKey) {
              throw new Error(`Falta la clave del producto`);
            }
            const product = (await getProductByKey({
              key: productKey,
            })) as IProduct;
            if (!product) {
              throw new Error(
                `Producto con clave "${productKey}" no encontrado`
              );
            }
            return product.id;
          })
        );
        filter.products = productIds;
      }

      // Crear los filtros con sus productos
      await Promise.all(
        structuredData.filters.map(async (filter) => {
          await createProductFilter({
            data: {
              key: filter.key,
              name: filter.name,
              groupId: filterGroupId,
              products: {
                create: filter.products.map((id: string) => ({
                  productId: id,
                })),
              },
            },
          });
        })
      );
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error interno al agregar las colecciones al grupo",
    };
  }
}

export async function addProductsToFilterFromGroup(
  productsKeys: string[],
  productFilterId: string
) {
  try {
    await isAdmin();

    const productIds = await Promise.all(
      productsKeys.map(async (productKey: string) => {
        if (!productKey) {
          throw new Error(`Falta la clave del producto`);
        }
        const product = (await getProductByKey({
          key: productKey,
        })) as IProduct;
        if (!product) {
          throw new Error(`Producto con clave "${productKey}" no encontrado`);
        }
        return product.id;
      })
    );

    await updateProductFilter({
      id: productFilterId,
      data: {
        products: {
          create: productIds.map((id: string) => ({ productId: id })),
        },
      },
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error interno al agregar los productos al filtro",
    };
  }
}

export async function deleteCollectionFromFilter(
  filterId: string,
  collectionId: string
) {
  try {
    await isAdmin();

    const filter = await read({ id: filterId });

    if (!filter) {
      throw new Error("Filter not found");
    }

    await update({
      id: filterId,
      data: {
        collections: {
          delete: {
            collectionId_groupId: {
              collectionId: collectionId,
              groupId: filterId,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error interno al eliminar la colección del filtro",
    };
  }
}

export async function deleteMassiveCollectionFromFilter(
  filterId: string,
  collectionIds: string[]
) {
  try {
    await isAdmin();

    await update({
      id: filterId,
      data: {
        collections: {
          delete: collectionIds.map((id) => ({
            collectionId_groupId: {
              collectionId: id,
              groupId: filterId,
            },
          })),
        },
      },
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error interno al eliminar las colecciones del filtro",
    };
  }
}

// export async function addProductFiltersToGroup(
//   filterGroupId: string,
//   formData: FormData
// ) {
//   const someDataEmpty = Array.from(formData.entries()).some(
//     ([, value]) => !value
//   );

//   if (someDataEmpty) {
//     return { success: false, message: "Faltan datos" };
//   }

//   const structuredData = Array.from(formData.entries())
//     .map(([name, value]) => ({
//       name,
//       value: value.toString(),
//     }))
//     .reduce<{
//       filters: {
//         name: string;
//         key: string;
//         products: string[];
//       }[];
//     }>(
//       (acc, field) => {
//         const { name, value } = field;

//         if (name === "filterName") {
//           acc.filters.push({ name: value, key: "", products: [] });
//         } else if (name === "filterKey") {
//           acc.filters[acc.filters.length - 1].key = value;
//         } else if (name.startsWith("product-")) {
//           const index = parseInt(name.split("-")[1], 10);
//           acc.filters[index]?.products.push(value);
//         }

//         return acc;
//       },
//       { filters: [] }
//     );

//   try {
//     await isAdmin();

//     for (const filter of structuredData.filters) {
//       const productIds = await Promise.all(
//         filter.products.map(async (productKey: string) => {
//           if (!productKey) {
//             throw new Error(`Falta la clave del producto`);
//           }
//           const product = (await getProductByKey({
//             key: productKey,
//           })) as IProduct;
//           if (!product) {
//             throw new Error(`Producto con clave "${productKey}" no encontrado`);
//           }
//           return product.id;
//         })
//       );
//       filter.products = productIds;
//     }

//     await Promise.all(
//       structuredData.filters.map(async (filter) => {
//         await createProductFilter({
//           data: {
//             key: filter.key,
//             name: filter.name,
//             groupId: filterGroupId,
//             products: {
//               create: filter.products.map((id: string) => ({ productId: id })),
//             },
//           },
//         });
//       })
//     );
//   } catch (error) {
//     console.error(error);
//     return {
//       success: false,
//       message: "Error interno al agregar los filtros al grupo",
//     };
//   }
// }

export async function updateProductFilterFromGroup(
  formData: FormData,
  productFilterId: string
) {
  const dataToValidate = {
    name: formData.get("name"),
    key: formData.get("key"),
  };

  const errors = validateSchema("update", dataToValidate);

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Error en la validación de los datos",
      errors,
    };
  }

  try {
    await isAdmin();

    await updateProductFilter({
      id: productFilterId,
      data: {
        name: formData.get("name") as string,
        key: formData.get("key") as string,
      },
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error interno al actualizar el filtro de producto",
    };
  }
}

export async function deleteProductFilterFromGroup(productFilterId: string) {
  try {
    await isAdmin();

    await removeProductFilter({ id: productFilterId });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error interno al eliminar el filtro de producto",
    };
  }
}

export async function deleteMassiveProductFilterFromGroup(
  productFilterIds: string[]
) {
  try {
    await isAdmin();

    await Promise.all(
      productFilterIds.map(async (id) => removeProductFilter({ id }))
    );
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Error interno al eliminar los filtros de producto seleccionados",
    };
  }
}

export async function deleteProductFromFilterFromGroup(
  productFilterId: string,
  productId: string
) {
  try {
    await isAdmin();

    await updateProductFilter({
      id: productFilterId,
      data: {
        products: {
          delete: {
            productId_filterId: {
              productId,
              filterId: productFilterId,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error interno al eliminar el producto del filtro",
    };
  }
}

export async function deleteMassiveProductFromFilterFromGroup(
  productFilterId: string,
  productIds: string[]
) {
  try {
    await isAdmin();

    await updateProductFilter({
      id: productFilterId,
      data: {
        products: {
          delete: productIds.map((id) => ({
            productId_filterId: {
              productId: id,
              filterId: productFilterId,
            },
          })),
        },
      },
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error interno al eliminar los productos del filtro",
    };
  }
}
