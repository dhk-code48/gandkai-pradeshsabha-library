import prismadb from "@/lib/prismadb";

import { CategoryForm } from "./_components/category-form";

const CategoryPage = async ({ params }: { params: { shelfId: string; siteId: string } }) => {
  const category = await prismadb.shelf.findUnique({
    where: {
      id: params.shelfId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} />
      </div>
    </div>
  );
};

export default CategoryPage;
