import prismadb from "@/lib/prismadb";

import { MembersClient } from "./_components/client";
import { Book, IssueRecord, User } from "@prisma/client";

const MembersPage = async () => {
  const users = await prismadb.user.findMany({
    where: {
      role: "MEMBER",
    },
    orderBy: {
      memeberId: "asc",
    },
    include: {
      issueRecords: {
        include: {
          book: true,
        },
      },
    },
  });

  const formattedProducts: (User & {
    issueRecords: (IssueRecord & { book: Book })[];
  })[] = users.map((user) => ({
    id: user.id,
    email: user.email,
    image: user.image,
    password: "",
    role: user.role,
    emailVerified: null,
    address: user.address,
    phone: user.phone,
    post: user.post,
    issueRecords: user.issueRecords,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    memeberId: user.memeberId,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1">
        <MembersClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default MembersPage;
