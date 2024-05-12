import prismadb from "@/lib/prismadb";

import { BooksClient } from "./_components/client";
import { Book } from "@prisma/client";

const ProductsPage = async ({ params }: { params: { schoolId: string } }) => {
  const products = await prismadb.book.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: Book[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    publishedDate: item.publishedDate,
    shelfCategory: item.shelfCategory,
    shelfId: item.shelfId,
    category: item.category,
    authors: item.authors,
    price: item.price,
    totalPages: item.totalPages,
    stock: item.stock,
    bannerUrl: item.bannerUrl,
    createdAt: item.createdAt,
    total: item.total,
    publication: item.publication,
    imageUrl: item.imageUrl,
    updatedAt: item.updatedAt,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1">
        <BooksClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
